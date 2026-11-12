const simbolos = {
    TELA: "tela",
    RETA: "reta",
    CIRCULO: "circulo",
    RETANGULO: "retangulo",
    GRUPO: "grupo",
    GIRAR: "girar",
    MOVER: "mover",
    TRACO: "traco",
    FUNDO: "fundo",
    ESPESSURA: "espessura",
    ABREPAR: "(",
    FECHAPAR: ")",
    VIRGULA: ",",
    IGUAL: "=",
    ABRECHAVE: "{",
    FECHACHAVE: "}"
};

function nomeDoToken(tipo) {
    if (simbolos[tipo] !== undefined) {
        return tipo + ' "' + simbolos[tipo] + '"';
    }
    return tipo;
}

export class ErroSintatico extends Error {
    constructor(linha, esperado, encontrado) {
        super("Erro sintático na linha " + linha + ": esperado " + esperado + ", encontrado " + encontrado);
        this.linha = linha;
        this.esperado = esperado;
        this.encontrado = encontrado;
    }
}

export function analisarSintatico(tokens) {
    let i = 0;
    const ultimaLinha = tokens.length > 0 ? tokens[tokens.length - 1].linha : 1;

    function atual() {
        return tokens[i];
    }

    function ve(tipo) {
        return atual() !== undefined && atual().tipo === tipo;
    }

    function linhaAtual() {
        return atual() !== undefined ? atual().linha : ultimaLinha;
    }

    function falhar(esperado) {
        const token = atual();
        if (token === undefined) {
            throw new ErroSintatico(ultimaLinha, esperado, "o fim do programa");
        }
        throw new ErroSintatico(token.linha, esperado, token.tipo + ' "' + token.lexema + '"');
    }

    function esperar(tipo) {
        if (!ve(tipo)) {
            falhar(nomeDoToken(tipo));
        }
        const token = tokens[i];
        i = i + 1;
        return token;
    }

    function numero() {
        return Number(esperar("NUM").lexema);
    }

    function argumentos(quantidade) {
        esperar("ABREPAR");
        const valores = [numero()];
        while (valores.length < quantidade) {
            esperar("VIRGULA");
            valores.push(numero());
        }
        esperar("FECHAPAR");
        return valores;
    }

    function comecaElemento() {
        return ve("RETA") || ve("CIRCULO") || ve("RETANGULO") || ve("GRUPO");
    }

    function programa() {
        const linha = linhaAtual();
        if (!ve("TELA")) {
            falhar('TELA "tela" (a declaração da tela é obrigatória no início)');
        }
        const tela = declaracaoTela();
        const elementos = listaElementos();
        if (atual() !== undefined) {
            falhar("uma forma (reta, circulo, retangulo), um grupo ou o fim do programa");
        }
        return { tipo: "Programa", linha, tela, elementos };
    }

    function declaracaoTela() {
        const linha = linhaAtual();
        esperar("TELA");
        const [largura, altura] = argumentos(2);
        return { tipo: "Tela", linha, largura, altura };
    }

    function listaElementos() {
        const elementos = [];
        while (comecaElemento()) {
            elementos.push(elemento());
        }
        return elementos;
    }

    function elemento() {
        if (ve("GRUPO")) {
            return grupo();
        }
        return forma();
    }

    function forma() {
        const linha = linhaAtual();
        if (ve("RETA")) {
            esperar("RETA");
            const [x1, y1, x2, y2] = argumentos(4);
            return { tipo: "Reta", linha, x1, y1, x2, y2, estilo: estilo() };
        }
        if (ve("CIRCULO")) {
            esperar("CIRCULO");
            const [cx, cy, raio] = argumentos(3);
            return { tipo: "Circulo", linha, cx, cy, raio, estilo: estilo() };
        }
        if (ve("RETANGULO")) {
            esperar("RETANGULO");
            const [x, y, largura, altura] = argumentos(4);
            return { tipo: "Retangulo", linha, x, y, largura, altura, estilo: estilo() };
        }
        falhar("uma forma (reta, circulo, retangulo) ou um grupo");
    }

    // Os atributos de estilo podem vir em qualquer ordem, e o último repetido vale.
    function estilo() {
        const resultado = { traco: null, preenchimento: null, espessura: null };
        while (ve("TRACO") || ve("FUNDO") || ve("ESPESSURA")) {
            if (ve("TRACO")) {
                esperar("TRACO");
                esperar("IGUAL");
                resultado.traco = cor();
            } else if (ve("FUNDO")) {
                esperar("FUNDO");
                esperar("IGUAL");
                resultado.preenchimento = cor();
            } else {
                esperar("ESPESSURA");
                esperar("IGUAL");
                resultado.espessura = numero();
            }
        }
        return resultado;
    }

    function cor() {
        if (ve("COR_NOME") || ve("COR_HEX")) {
            const token = atual();
            i = i + 1;
            return token.lexema;
        }
        falhar("uma cor (COR_NOME ou COR_HEX)");
    }

    function grupo() {
        const linha = linhaAtual();
        esperar("GRUPO");
        const modificadores = [];
        while (ve("GIRAR") || ve("MOVER")) {
            modificadores.push(modificador());
        }
        if (!ve("ABRECHAVE")) {
            falhar('GIRAR "girar", MOVER "mover" ou ABRECHAVE "{"');
        }
        esperar("ABRECHAVE");
        if (!comecaElemento()) {
            falhar("uma forma ou um grupo (o grupo não pode ser vazio)");
        }
        const elementos = listaElementos();
        if (!ve("FECHACHAVE")) {
            falhar('uma forma, um grupo ou FECHACHAVE "}"');
        }
        esperar("FECHACHAVE");
        return { tipo: "Grupo", linha, modificadores, elementos };
    }

    function modificador() {
        const linha = linhaAtual();
        if (ve("GIRAR")) {
            esperar("GIRAR");
            const [angulo] = argumentos(1);
            return { tipo: "Rotacao", linha, angulo };
        }
        esperar("MOVER");
        const [dx, dy] = argumentos(2);
        return { tipo: "Deslocamento", linha, dx, dy };
    }

    return programa();
}
