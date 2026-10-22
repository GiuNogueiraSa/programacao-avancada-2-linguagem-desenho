import { regras } from "./tokens.js";

export function analisarLexico(texto) {
    const tokens = [];
    const erros = [];
    let pos = 0;
    let linha = 1;

    while (pos < texto.length) {
        let achou = false;

        for (const regra of regras) {
            regra.padrao.lastIndex = pos;
            const m = regra.padrao.exec(texto);

            if (m) {
                if (!regra.ignorar) {
                    tokens.push({ tipo: regra.tipo, lexema: m[0], linha });
                }
                for (const caractere of m[0]) {
                    if (caractere === "\n") {
                        linha = linha + 1;
                    }
                }
                pos = regra.padrao.lastIndex;
                achou = true;
                break;
            }
        }

        if (!achou) {
            let fim = pos;
            while (fim < texto.length && !/\s/.test(texto[fim])) {
                fim = fim + 1;
            }
            erros.push({ linha, lexema: texto.slice(pos, fim) });
            pos = fim;
        }
    }

    return { tokens, erros };
}
