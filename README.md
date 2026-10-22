# Linguagem de desenho — Fase 1

Laboratório de Programação Avançada II (Compiladores).
Análise léxica, análise sintática e geração da AST de uma linguagem de comandos para descrever desenhos.

## Integrantes

| Nome completo | RA |
|---|---|
| Giulia Nogueira Lopes de Sá | 23024383 |
| Ruan Paulo de Sousa Soares | 23024986 |

## Entrega

| Arquivo | Conteúdo |
|---|---|
| [`especificacao.pdf`](especificacao.pdf) / [`especificacao.docx`](especificacao.docx) | Especificação: descrição da linguagem, definição léxica, gramática, tabela da AST e decisões de projeto |
| [`tokens.js`](tokens.js) | Regras léxicas (expressões regulares) |
| [`lexer.js`](lexer.js) | Analisador léxico |
| [`parser.js`](parser.js) | Analisador sintático descendente recursivo e geração da AST |
| [`main.js`](main.js) | Liga a página às duas fases e carrega os casos de teste |
| [`index.html`](index.html) | Página de teste |
| [`casos-de-teste.md`](casos-de-teste.md) | 5 programas válidos e 3 inválidos, com o resultado esperado |

## Como executar

**Página online:** https://giunogueirasa.github.io/programacao-avancada-2-linguagem-desenho/

Para rodar localmente: os arquivos usam módulos JavaScript (`type="module"`), que o navegador não carrega abrindo o `index.html` direto do disco. Use uma destas opções:

- abrir a pasta no VS Code e usar a extensão **Live Server**; ou
- rodar `python -m http.server` na pasta e acessar `http://localhost:8000`.

Na página, escolha um dos casos de teste no seletor ou digite um programa e clique em **Analisar**. A página mostra os tokens (linha, tipo e lexema) e, conforme o caso, os erros léxicos, o erro sintático ou a AST (em árvore e em JSON).

## A linguagem em resumo

```
tela(400, 300)
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
}
```

| Elemento | Sintaxe |
|---|---|
| Tela | `tela(largura, altura)`, obrigatória e no início |
| Formas | `reta(x1, y1, x2, y2)`, `circulo(cx, cy, raio)`, `retangulo(x, y, largura, altura)` |
| Estilo (opcional, nesta ordem) | `traco=cor` `fundo=cor` `espessura=N` |
| Grupo | `grupo modificadores { formas e grupos }` |
| Modificadores (só em grupos) | `girar(ângulo)` e `mover(dx, dy)`, quantos quiser, na ordem escrita |
| Cores | `vermelho` `verde` `azul` `amarelo` `laranja` `roxo` `rosa` `preto` `branco` `cinza` ou `#RRGGBB` |
| Números | inteiros sem sinal; `0` é aceito, `05` é erro léxico |
| Comentário | `%` até o fim da linha |

### Gramática (símbolo inicial: `programa`)

```
programa       → tela elementos
tela           → TELA ABREPAR NUM VIRGULA NUM FECHAPAR
elementos      → elemento elementos | ε
elemento       → forma | grupo
forma          → RETA ABREPAR NUM VIRGULA NUM VIRGULA NUM VIRGULA NUM FECHAPAR estilo
               | CIRCULO ABREPAR NUM VIRGULA NUM VIRGULA NUM FECHAPAR estilo
               | RETANGULO ABREPAR NUM VIRGULA NUM VIRGULA NUM VIRGULA NUM FECHAPAR estilo
estilo         → traco_opc fundo_opc espessura_opc
traco_opc      → TRACO IGUAL cor | ε
fundo_opc      → FUNDO IGUAL cor | ε
espessura_opc  → ESPESSURA IGUAL NUM | ε
cor            → COR_NOME | COR_HEX
grupo          → GRUPO modificadores ABRECHAVE elemento elementos FECHACHAVE
modificadores  → modificador modificadores | ε
modificador    → GIRAR ABREPAR NUM FECHAPAR
               | MOVER ABREPAR NUM VIRGULA NUM FECHAPAR
```

A tabela completa de tokens, a tabela da AST e todas as decisões de projeto (grupo vazio, atributos repetidos, zeros à esquerda, comentário e cor hexadecimal) estão na [especificação](especificacao.pdf).
