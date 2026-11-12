# Casos de teste

Cada caso pode ser carregado na página pelo seletor **Casos de teste**. Os resultados abaixo foram obtidos executando o analisador.

## Programas válidos

Em conjunto, os cinco programas usam todos os elementos da linguagem: tela, as três formas, os três atributos, as dez cores nomeadas, cores hexadecimais, grupos aninhados (até três níveis), os dois modificadores e comentários.

### Válido 1 — Tela em branco

```
% o menor programa possível: só a tela
tela(200, 100)
```

**O que testa:** Tela mínima, comentário em linha inteira e programa sem nenhuma forma.

**Resultado esperado:** programa válido (6 tokens). AST gerada:

```json
{
  "tipo": "Programa",
  "tela": {
    "tipo": "Tela",
    "largura": 200,
    "altura": 100
  },
  "elementos": []
}
```

### Válido 2 — Carro

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

**O que testa:** Retângulo, círculo e reta; preenchimento, traço e espessura; deslocamento e rotação; **grupo dentro de grupo**; comentários entre comandos.

**Resultado esperado:** programa válido (82 tokens). AST gerada:

```json
{
  "tipo": "Programa",
  "tela": {
    "tipo": "Tela",
    "largura": 400,
    "altura": 300
  },
  "elementos": [
    {
      "tipo": "Retangulo",
      "x": 50,
      "y": 150,
      "largura": 200,
      "altura": 60,
      "estilo": {
        "traco": null,
        "preenchimento": "azul",
        "espessura": null
      }
    },
    {
      "tipo": "Grupo",
      "modificadores": [
        {
          "tipo": "Deslocamento",
          "dx": 70,
          "dy": 190
        }
      ],
      "elementos": [
        {
          "tipo": "Circulo",
          "cx": 0,
          "cy": 0,
          "raio": 25,
          "estilo": {
            "traco": null,
            "preenchimento": "preto",
            "espessura": null
          }
        },
        {
          "tipo": "Grupo",
          "modificadores": [
            {
              "tipo": "Rotacao",
              "angulo": 45
            }
          ],
          "elementos": [
            {
              "tipo": "Reta",
              "x1": 0,
              "y1": 0,
              "x2": 20,
              "y2": 0,
              "estilo": {
                "traco": "branco",
                "preenchimento": null,
                "espessura": 2
              }
            }
          ]
        }
      ]
    },
    {
      "tipo": "Grupo",
      "modificadores": [
        {
          "tipo": "Deslocamento",
          "dx": 200,
          "dy": 190
        }
      ],
      "elementos": [
        {
          "tipo": "Circulo",
          "cx": 0,
          "cy": 0,
          "raio": 25,
          "estilo": {
            "traco": null,
            "preenchimento": "preto",
            "espessura": null
          }
        }
      ]
    }
  ]
}
```

### Válido 3 — Casa com cores hexadecimais

```
tela(300, 300)
retangulo(0, 200, 300, 100) fundo=#3A7D44
retangulo(75, 120, 150, 120) traco=#5C3317 fundo=#F5DEB3 espessura=3
reta(75, 120, 150, 50) traco=vermelho espessura=4
reta(150, 50, 225, 120) traco=vermelho espessura=4
retangulo(135, 180, 30, 60) fundo=#8B4513
```

**O que testa:** Cores hexadecimais (maiúsculas) e nomeadas, os três atributos juntos na ordem traco, fundo, espessura.

**Resultado esperado:** programa válido (83 tokens). AST gerada:

```json
{
  "tipo": "Programa",
  "tela": {
    "tipo": "Tela",
    "largura": 300,
    "altura": 300
  },
  "elementos": [
    {
      "tipo": "Retangulo",
      "x": 0,
      "y": 200,
      "largura": 300,
      "altura": 100,
      "estilo": {
        "traco": null,
        "preenchimento": "#3A7D44",
        "espessura": null
      }
    },
    {
      "tipo": "Retangulo",
      "x": 75,
      "y": 120,
      "largura": 150,
      "altura": 120,
      "estilo": {
        "traco": "#5C3317",
        "preenchimento": "#F5DEB3",
        "espessura": 3
      }
    },
    {
      "tipo": "Reta",
      "x1": 75,
      "y1": 120,
      "x2": 150,
      "y2": 50,
      "estilo": {
        "traco": "vermelho",
        "preenchimento": null,
        "espessura": 4
      }
    },
    {
      "tipo": "Reta",
      "x1": 150,
      "y1": 50,
      "x2": 225,
      "y2": 120,
      "estilo": {
        "traco": "vermelho",
        "preenchimento": null,
        "espessura": 4
      }
    },
    {
      "tipo": "Retangulo",
      "x": 135,
      "y": 180,
      "largura": 30,
      "altura": 60,
      "estilo": {
        "traco": null,
        "preenchimento": "#8B4513",
        "espessura": null
      }
    }
  ]
}
```

### Válido 4 — Grupos aninhados e modificadores em ordem

```
tela(500, 500)
grupo mover(250, 250) girar(30) {          % deslocamento e depois rotação
    circulo(0, 0, 100) traco=cinza
    grupo girar(90) mover(10, 0) {        % rotação e depois deslocamento
        retangulo(0, 0, 40, 40) fundo=amarelo
        grupo {                            % grupo sem modificadores
            reta(0, 0, 0, 80) traco=roxo espessura=1
        }
    }
}
```

**O que testa:** Três níveis de grupos, grupo sem modificadores, dois modificadores no mesmo grupo em ordens diferentes (a ordem é mantida na AST), comentários no fim da linha.

**Resultado esperado:** programa válido (75 tokens). AST gerada:

```json
{
  "tipo": "Programa",
  "tela": {
    "tipo": "Tela",
    "largura": 500,
    "altura": 500
  },
  "elementos": [
    {
      "tipo": "Grupo",
      "modificadores": [
        {
          "tipo": "Deslocamento",
          "dx": 250,
          "dy": 250
        },
        {
          "tipo": "Rotacao",
          "angulo": 30
        }
      ],
      "elementos": [
        {
          "tipo": "Circulo",
          "cx": 0,
          "cy": 0,
          "raio": 100,
          "estilo": {
            "traco": "cinza",
            "preenchimento": null,
            "espessura": null
          }
        },
        {
          "tipo": "Grupo",
          "modificadores": [
            {
              "tipo": "Rotacao",
              "angulo": 90
            },
            {
              "tipo": "Deslocamento",
              "dx": 10,
              "dy": 0
            }
          ],
          "elementos": [
            {
              "tipo": "Retangulo",
              "x": 0,
              "y": 0,
              "largura": 40,
              "altura": 40,
              "estilo": {
                "traco": null,
                "preenchimento": "amarelo",
                "espessura": null
              }
            },
            {
              "tipo": "Grupo",
              "modificadores": [],
              "elementos": [
                {
                  "tipo": "Reta",
                  "x1": 0,
                  "y1": 0,
                  "x2": 0,
                  "y2": 80,
                  "estilo": {
                    "traco": "roxo",
                    "preenchimento": null,
                    "espessura": 1
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Válido 5 — Formato livre e zeros

```
tela(0,0) circulo(0,0,0) traco = rosa fundo = laranja espessura = 0 reta(10,10,10,10)traco=verde
grupo mover(0,0)mover(5,5){retangulo(1,2,3,4)fundo=#00ff00}
```

**O que testa:** Zero como número (tela, coordenadas, raio e espessura), espaços em volta do `=`, vários comandos na mesma linha, nenhum espaço entre os símbolos, modificador repetido e cor hexadecimal minúscula.

**Resultado esperado:** programa válido (64 tokens). AST gerada:

```json
{
  "tipo": "Programa",
  "tela": {
    "tipo": "Tela",
    "largura": 0,
    "altura": 0
  },
  "elementos": [
    {
      "tipo": "Circulo",
      "cx": 0,
      "cy": 0,
      "raio": 0,
      "estilo": {
        "traco": "rosa",
        "preenchimento": "laranja",
        "espessura": 0
      }
    },
    {
      "tipo": "Reta",
      "x1": 10,
      "y1": 10,
      "x2": 10,
      "y2": 10,
      "estilo": {
        "traco": "verde",
        "preenchimento": null,
        "espessura": null
      }
    },
    {
      "tipo": "Grupo",
      "modificadores": [
        {
          "tipo": "Deslocamento",
          "dx": 0,
          "dy": 0
        },
        {
          "tipo": "Deslocamento",
          "dx": 5,
          "dy": 5
        }
      ],
      "elementos": [
        {
          "tipo": "Retangulo",
          "x": 1,
          "y": 2,
          "largura": 3,
          "altura": 4,
          "estilo": {
            "traco": null,
            "preenchimento": "#00ff00",
            "espessura": null
          }
        }
      ]
    }
  ]
}
```

## Programas inválidos

### Inválido 1 — Erros léxicos

```
tela(300, 200)
circulo(50, 50, 20) traco=#12ab fundo=azul
quadrado 10 10
retangulo(10, 10, 50, 30) espessura=05
```

**O que testa:** Três erros léxicos, um por linha. Como há erro léxico, a análise sintática **não é executada**.

**Resultado esperado:** erro léxico.

```
Linha 2: "#12ab" não forma nenhum token
Linha 3: "quadrado" não forma nenhum token
Linha 4: "05" não forma nenhum token
```

### Inválido 2 — Erro sintático: falta um argumento

```
tela(300, 200)
retangulo(10, 10, 50, 30)
circulo(100, 100) fundo=verde
```

**O que testa:** Os tokens estão corretos, mas `circulo` exige três números. Depois de `100` o parser esperava a vírgula do terceiro argumento e encontrou `)`.

**Resultado esperado:** erro sintático.

```
Linha: 3
Esperado: VIRGULA ","
Encontrado: FECHAPAR ")"
```

### Inválido 3 — Erro sintático: grupo não fechado

```
tela(300, 200)
grupo mover(10, 10) {
    reta(0, 0, 100, 0)
    circulo(50, 50, 10)

```

**O que testa:** O grupo aberto na linha 2 nunca é fechado. O programa acaba quando o parser ainda esperava outro elemento ou a `}`. A linha informada é a do último token.

**Resultado esperado:** erro sintático.

```
Linha: 4
Esperado: uma forma, um grupo ou FECHACHAVE "}"
Encontrado: o fim do programa
```

