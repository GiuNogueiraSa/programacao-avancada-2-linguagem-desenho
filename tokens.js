export const regras = [
    { tipo: "ESPACO", padrao: /\s+/y, ignorar: true },
    { tipo: "COMENTARIO", padrao: /%[^\n]*/y, ignorar: true },
    { tipo: "TELA", padrao: /tela(?![\wÀ-ÿ])/y },
    { tipo: "RETANGULO", padrao: /retangulo(?![\wÀ-ÿ])/y },
    { tipo: "RETA", padrao: /reta(?![\wÀ-ÿ])/y },
    { tipo: "CIRCULO", padrao: /circulo(?![\wÀ-ÿ])/y },
    { tipo: "GRUPO", padrao: /grupo(?![\wÀ-ÿ])/y },
    { tipo: "GIRAR", padrao: /girar(?![\wÀ-ÿ])/y },
    { tipo: "MOVER", padrao: /mover(?![\wÀ-ÿ])/y },
    { tipo: "TRACO", padrao: /traco(?![\wÀ-ÿ])/y },
    { tipo: "FUNDO", padrao: /fundo(?![\wÀ-ÿ])/y },
    { tipo: "ESPESSURA", padrao: /espessura(?![\wÀ-ÿ])/y },
    {
        tipo: "COR_NOME",
        padrao: /(?:vermelho|verde|azul|amarelo|laranja|roxo|rosa|preto|branco|cinza)(?![\wÀ-ÿ])/y
    },
    { tipo: "COR_HEX", padrao: /#[0-9A-Fa-f]{6}(?![\wÀ-ÿ])/y },
    { tipo: "NUM", padrao: /(?:0|[1-9][0-9]*)(?![\wÀ-ÿ])/y },
    { tipo: "ABREPAR", padrao: /\(/y },
    { tipo: "FECHAPAR", padrao: /\)/y },
    { tipo: "VIRGULA", padrao: /,/y },
    { tipo: "IGUAL", padrao: /=/y },
    { tipo: "ABRECHAVE", padrao: /\{/y },
    { tipo: "FECHACHAVE", padrao: /\}/y }
];
