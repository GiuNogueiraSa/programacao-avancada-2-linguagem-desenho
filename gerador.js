// gerador.js · gera o texto SVG a partir da AST (Fase 2)
//
//   Recebe:  a AST do programa (já verificada semanticamente)
//   Devolve: uma string com o SVG completo, começando em <svg ...> e terminando em </svg>
//
// Decisões de projeto:
//   - Estilo ausente: traço preto (stroke="black"), espessura 1 e sem preenchimento (fill="none").
//   - Cada forma escreve sempre os três atributos: fill, stroke e stroke-width.
//   - Grupo sem modificadores vira <g> sem atributo transform.
//   - Os modificadores de um grupo viram um único transform, na ordem em que foram escritos.
//   - Os nomes de cor da linguagem viram nomes de cor do SVG (tabela CORES); #RRGGBB passa direto.

const CORES = {
    vermelho: "red",
    verde: "green",
    azul: "blue",
    amarelo: "yellow",
    laranja: "orange",
    roxo: "purple",
    rosa: "pink",
    preto: "black",
    branco: "white",
    cinza: "gray"
};

function cor(nome) {
    return nome.startsWith("#") ? nome : CORES[nome];
}

// Devolve os três atributos de estilo, já com os padrões aplicados.
function atributosDeEstilo(estilo) {
    const stroke = estilo.traco !== null ? cor(estilo.traco) : "black";
    const fill = estilo.preenchimento !== null ? cor(estilo.preenchimento) : "none";
    const espessura = estilo.espessura !== null ? estilo.espessura : 1;
    return 'fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + espessura + '"';
}

function transformDoGrupo(modificadores) {
    return modificadores
        .map(function (m) {
            return m.tipo === "Rotacao" ? "rotate(" + m.angulo + ")" : "translate(" + m.dx + " " + m.dy + ")";
        })
        .join(" ");
}

function gerarNo(no, recuo) {
    const pad = "  ".repeat(recuo);

    if (no.tipo === "Reta") {
        return [pad + '<line x1="' + no.x1 + '" y1="' + no.y1 + '" x2="' + no.x2 + '" y2="' + no.y2 + '" ' + atributosDeEstilo(no.estilo) + "/>"];
    }

    if (no.tipo === "Circulo") {
        return [pad + '<circle cx="' + no.cx + '" cy="' + no.cy + '" r="' + no.raio + '" ' + atributosDeEstilo(no.estilo) + "/>"];
    }

    if (no.tipo === "Retangulo") {
        return [pad + '<rect x="' + no.x + '" y="' + no.y + '" width="' + no.largura + '" height="' + no.altura + '" ' + atributosDeEstilo(no.estilo) + "/>"];
    }

    if (no.tipo === "Grupo") {
        const transform = transformDoGrupo(no.modificadores);
        const abertura = transform === "" ? "<g>" : '<g transform="' + transform + '">';
        const linhas = [pad + abertura];
        no.elementos.forEach(function (filho) {
            gerarNo(filho, recuo + 1).forEach(function (l) {
                linhas.push(l);
            });
        });
        linhas.push(pad + "</g>");
        return linhas;
    }

    throw new Error("nó desconhecido no gerador: " + no.tipo);
}

export function gerarSVG(ast) {
    const { largura, altura } = ast.tela;
    const linhas = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + largura + '" height="' + altura + '" viewBox="0 0 ' + largura + " " + altura + '">'
    ];
    ast.elementos.forEach(function (elemento) {
        gerarNo(elemento, 1).forEach(function (l) {
            linhas.push(l);
        });
    });
    linhas.push("</svg>");
    return linhas.join("\n") + "\n";
}
