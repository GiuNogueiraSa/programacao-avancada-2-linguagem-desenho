import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";

export const casos = [
    {
        nome: "Válido 1 — Tela em branco",
        codigo: `% o menor programa possível: só a tela
tela(200, 100)`
    },
    {
        nome: "Válido 2 — Carro",
        codigo: `tela(400, 300)
% corpo do carro
retangulo(50, 150, 200, 60) fundo=azul

% roda dianteira, com um raio girado
grupo mover(70, 190) {
    circulo(0, 0, 25) fundo=preto
    grupo girar(45) {
        reta(0, 0, 20, 0) traco=branco espessura=2
    }
}

% roda traseira
grupo mover(200, 190) {
    circulo(0, 0, 25) fundo=preto
}`
    },
    {
        nome: "Válido 3 — Casa com cores hexadecimais",
        codigo: `tela(300, 300)
retangulo(0, 200, 300, 100) fundo=#3A7D44
retangulo(75, 120, 150, 120) traco=#5C3317 fundo=#F5DEB3 espessura=3
reta(75, 120, 150, 50) traco=vermelho espessura=4
reta(150, 50, 225, 120) traco=vermelho espessura=4
retangulo(135, 180, 30, 60) fundo=#8B4513`
    },
    {
        nome: "Válido 4 — Grupos aninhados e modificadores em ordem",
        codigo: `tela(500, 500)
grupo mover(250, 250) girar(30) {          % deslocamento e depois rotação
    circulo(0, 0, 100) traco=cinza
    grupo girar(90) mover(10, 0) {        % rotação e depois deslocamento
        retangulo(0, 0, 40, 40) fundo=amarelo
        grupo {                            % grupo sem modificadores
            reta(0, 0, 0, 80) traco=roxo espessura=1
        }
    }
}`
    },
    {
        nome: "Válido 5 — Formato livre e zeros",
        codigo: `tela(0,0) circulo(0,0,0) traco = rosa fundo = laranja espessura = 0 reta(10,10,10,10)traco=verde
grupo mover(0,0)mover(5,5){retangulo(1,2,3,4)fundo=#00ff00}`
    },
    {
        nome: "Inválido 1 — Erros léxicos",
        codigo: `tela(300, 200)
circulo(50, 50, 20) traco=#12ab fundo=azul
quadrado 10 10
retangulo(10, 10, 50, 30) espessura=05`
    },
    {
        nome: "Inválido 2 — Erro sintático: falta um argumento",
        codigo: `tela(300, 200)
retangulo(10, 10, 50, 30)
circulo(100, 100) fundo=verde`
    },
    {
        nome: "Inválido 3 — Erro sintático: grupo não fechado",
        codigo: `tela(300, 200)
grupo mover(10, 10) {
    reta(0, 0, 100, 0)
    circulo(50, 50, 10)
`
    }
];

const entrada = document.getElementById("entrada");
const seletor = document.getElementById("exemplos");

for (let k = 0; k < casos.length; k++) {
    const opcao = document.createElement("option");
    opcao.value = k;
    opcao.textContent = casos[k].nome;
    seletor.appendChild(opcao);
}

seletor.addEventListener("change", function () {
    if (seletor.value !== "") {
        entrada.value = casos[Number(seletor.value)].codigo;
        analisar();
    }
});

function celula(linha, texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    linha.appendChild(td);
}

function mostrarTokens(tokens) {
    const corpo = document.getElementById("corpoTokens");
    corpo.innerHTML = "";
    for (const token of tokens) {
        const tr = document.createElement("tr");
        celula(tr, token.linha);
        celula(tr, token.tipo);
        celula(tr, token.lexema);
        corpo.appendChild(tr);
    }
    document.getElementById("totalTokens").textContent = tokens.length + " tokens";
}

function descreverNo(no) {
    if (no.tipo === "Tela") return "Tela " + no.largura + " x " + no.altura;
    if (no.tipo === "Reta") return "Reta (" + no.x1 + ", " + no.y1 + ") até (" + no.x2 + ", " + no.y2 + ")";
    if (no.tipo === "Circulo") return "Circulo centro (" + no.cx + ", " + no.cy + ") raio " + no.raio;
    if (no.tipo === "Retangulo") return "Retangulo (" + no.x + ", " + no.y + ") " + no.largura + " x " + no.altura;
    if (no.tipo === "Rotacao") return "Rotacao " + no.angulo;
    if (no.tipo === "Deslocamento") return "Deslocamento (" + no.dx + ", " + no.dy + ")";
    return no.tipo;
}

function descreverEstilo(estilo) {
    const partes = [];
    if (estilo.traco !== null) partes.push("traço " + estilo.traco);
    if (estilo.preenchimento !== null) partes.push("preenchimento " + estilo.preenchimento);
    if (estilo.espessura !== null) partes.push("espessura " + estilo.espessura);
    return partes.length > 0 ? " [" + partes.join(", ") + "]" : "";
}

function arvore(no, prefixo, ultimo, linhas) {
    const ramo = prefixo === null ? "" : prefixo + (ultimo ? "└─ " : "├─ ");
    const proximo = prefixo === null ? "" : prefixo + (ultimo ? "   " : "│  ");
    let texto = descreverNo(no);
    if (no.estilo) texto += descreverEstilo(no.estilo);
    linhas.push(ramo + texto);

    const filhos = [];
    if (no.tipo === "Programa") {
        filhos.push(no.tela, ...no.elementos);
    } else if (no.tipo === "Grupo") {
        filhos.push(...no.modificadores, ...no.elementos);
    }
    filhos.forEach(function (filho, k) {
        arvore(filho, proximo, k === filhos.length - 1, linhas);
    });
}

function mostrarResultado(classe, titulo, texto) {
    const caixa = document.getElementById("resultado");
    caixa.className = classe;
    document.getElementById("tituloResultado").textContent = titulo;
    document.getElementById("textoResultado").textContent = texto;
}

function analisar() {
    const { tokens, erros } = analisarLexico(entrada.value);
    mostrarTokens(tokens);

    const blocoAst = document.getElementById("blocoAst");
    blocoAst.hidden = true;

    if (erros.length > 0) {
        const mensagens = erros.map(function (erro) {
            return "Linha " + erro.linha + ': "' + erro.lexema + '" não forma nenhum token';
        });
        mostrarResultado("erro", "Erros léxicos (a análise sintática não foi executada)", mensagens.join("\n"));
        return;
    }

    try {
        const ast = analisarSintatico(tokens);
        mostrarResultado("ok", "Programa válido", "Análises léxica e sintática concluídas sem erros.");
        const linhas = [];
        arvore(ast, null, true, linhas);
        document.getElementById("arvore").textContent = linhas.join("\n");
        document.getElementById("json").textContent = JSON.stringify(ast, null, 2);
        blocoAst.hidden = false;
    } catch (falha) {
        if (falha.linha === undefined) {
            throw falha;
        }
        mostrarResultado(
            "erro",
            "Erro sintático",
            "Linha: " + falha.linha + "\nEsperado: " + falha.esperado + "\nEncontrado: " + falha.encontrado
        );
    }
}

document.getElementById("botao").addEventListener("click", analisar);

entrada.value = casos[1].codigo;
seletor.value = "1";
analisar();
