// semantica.js · verificações semânticas (Fase 2)
//
//   Recebe:  a AST do programa
//   Devolve: um vetor de erros: [ { linha, mensagem }, ... ]
//            (vetor vazio = nenhum erro encontrado)
//
// Percorre a AST inteira, inclusive os grupos aninhados, e junta todos os erros.

export function verificar(ast) {
    const erros = [];

    function erro(no, mensagem) {
        erros.push({ linha: no.linha, mensagem: mensagem });
    }

    function visitar(no) {
        switch (no.tipo) {
            case "Programa":
                visitar(no.tela);
                no.elementos.forEach(visitar);
                break;

            case "Tela":
                if (no.largura === 0 || no.altura === 0) {
                    erro(no, "a tela precisa ter largura e altura maiores que zero");
                }
                break;

            case "Circulo":
                if (no.raio === 0) {
                    erro(no, "o círculo precisa ter raio maior que zero");
                }
                break;

            case "Retangulo":
                if (no.largura === 0 || no.altura === 0) {
                    erro(no, "o retângulo precisa ter largura e altura maiores que zero");
                }
                break;

            case "Grupo":
                no.elementos.forEach(visitar);
                break;

            // Reta: a gramática aceita qualquer coordenada, então não há o que verificar.
        }
    }

    visitar(ast);
    return erros;
}
