# Material de referência

Pasta para os arquivos originais do cliente usados como referência visual.
Nenhum deles é necessário para rodar o projeto.

| Arquivo | O que é | Situação |
| --- | --- | --- |
| `logo-red-tennis.webp` | Logo oficial da Red Tennis | **A adicionar** |
| `sistema-antigo.png` | Print do sistema de gestão atual do cliente | **A adicionar** |

## Sobre o logo

O MVP **não depende** desses arquivos: a marca é desenhada em SVG vetorial em
`src/components/layout/Logo.tsx`, reconstruída a partir do logo original (quadra
de saibro em curva sobre o letreiro RED TENNIS).

Para passar a usar o arquivo oficial em vez do vetor:

1. copie a imagem para `public/` (ex.: `public/logo-red-tennis.webp`);
2. em `src/lib/branding.ts`, aponte `LOGO_OFICIAL` para esse caminho.

## Sobre o sistema antigo

O print do sistema atual serve como contraponto na apresentação: grade de ícones
pequenos, sem hierarquia visual e com navegação pouco clara. As decisões de
interface deste MVP — hierarquia tipográfica, espaço em branco, cards com sombra
suave e uma ação principal por tela — foram tomadas para tornar esse contraste
evidente.
