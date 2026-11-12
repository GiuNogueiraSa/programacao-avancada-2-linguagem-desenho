# Casos de teste · Fase 2

Os programas estão em `programas/`. Os arquivos `.svg` ficam em `svg/` e as imagens em `imagens/`.

## Programas válidos (5 da Fase 1 + desenho final)

| Arquivo | Descrição | Resultado |
|---|---|---|
| [`01-tela-em-branco.txt`](programas/01-tela-em-branco.txt) | Só a tela, 200 × 100 | [`01-tela-em-branco.svg`](svg/01-tela-em-branco.svg) · [imagem](imagens/01-tela-em-branco.png) |
| [`02-carro.txt`](programas/02-carro.txt) | Carro com rodas em grupos, roda com raio girado e modificadores | [`02-carro.svg`](svg/02-carro.svg) · [imagem](imagens/02-carro.png) |
| [`03-casa-cores-hexadecimais.txt`](programas/03-casa-cores-hexadecimais.txt) | Casa com cores em `#RRGGBB` e nomes de cor | [`03-casa-cores-hexadecimais.svg`](svg/03-casa-cores-hexadecimais.svg) · [imagem](imagens/03-casa-cores-hexadecimais.png) |
| [`04-grupos-aninhados.txt`](programas/04-grupos-aninhados.txt) | Grupos aninhados, rotação e deslocamento na ordem escrita, grupo sem modificadores | [`04-grupos-aninhados.svg`](svg/04-grupos-aninhados.svg) · [imagem](imagens/04-grupos-aninhados.png) |
| [`05-formato-livre.txt`](programas/05-formato-livre.txt) | Formato livre, espessura zero, dois modificadores seguidos sem espaço | [`05-formato-livre.svg`](svg/05-formato-livre.svg) · [imagem](imagens/05-formato-livre.png) |

O "Válido 5" da Fase 1 tinha `tela(0,0)` e `circulo(0,0,0)`. A gramática aceita esses zeros, mas a semântica não. Por isso ele virou um caso de erro semântico (abaixo), e o 05 acima é uma versão sem zeros de tela e raio.

## Programas com erro semântico (2 verificações diferentes)

| Arquivo | Erro | Mensagem exibida na página |
|---|---|---|
| [`erro-semantico-01-tela-e-circulo.txt`](programas/erro-semantico-01-tela-e-circulo.txt) | tela com largura zero (linha 1) e círculo com raio zero (linha 2) | `Erro semântico: linha 1: a tela precisa ter largura e altura maiores que zero` e `Erro semântico: linha 2: o círculo precisa ter raio maior que zero` |
| [`erro-semantico-02-retangulo-em-grupo.txt`](programas/erro-semantico-02-retangulo-em-grupo.txt) | retângulo com altura zero dentro de um grupo (linha 4) | `Erro semântico: linha 4: o retângulo precisa ter largura e altura maiores que zero` |

Nos dois casos, nenhum SVG é gerado.

## Desenho final

| Arquivo | Descrição | Resultado |
|---|---|---|
| [`desenho-final-robo.txt`](programas/desenho-final-robo.txt) | Robô com sol e chão: três formas, grupos aninhados, `mover` e `girar` | [`desenho-final-robo.svg`](svg/desenho-final-robo.svg) · [imagem](imagens/desenho-final-robo.png) |
