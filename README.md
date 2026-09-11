# MVP Red Tennis — Sistema de Gestão

Protótipo navegável (front-end) do sistema de gestão da arena **Red Tennis**,
desenvolvido pela **UFABC Júnior** como peça visual da proposta comercial.

A arena tem 4 quadras de saibro + 1 paredão e funciona das 7h às 22h. Hoje a
operação depende de planilhas, papel e um sistema antigo. Este MVP mostra como
seria a operação em um sistema moderno.

> **Este projeto não tem backend.** Todos os dados são fictícios e vivem em
> memória. É um artefato de demonstração — não um produto em produção.

**Demonstração online:** <https://mvp-red-tennis.vercel.app>

---

## Como rodar

Requer **Node.js 18.18+**.

```bash
npm install
npm run dev
```

Acesse <http://localhost:3000>. Não há nenhuma configuração adicional, variável
de ambiente, banco de dados ou serviço externo.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o ambiente de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | Roda o ESLint |

---

## As 5 telas

| Tela | Rota | O que mostra |
| --- | --- | --- |
| **Login** | `/` | Acesso individual por colaborador. Sem validação — qualquer entrada abre o sistema. |
| **Dashboard** | `/dashboard` | As 4 quadras + paredão em perspectiva 3D. O saibro escurece conforme a ocupação do dia. Clicar em uma quadra abre a agenda dela. |
| **Agenda** | `/agenda` | Grade semanal (7h–22h) e panorama mensal, com filtro por quadra, professor e tipo, legenda de cores e alerta de conflito. |
| **Ficha do Aluno** | `/alunos/[id]` | Matrícula, histórico de aulas com motivos de falta, saldo de reposição em minutos, pagamentos, congelamento de plano e observações do gestor. |
| **Financeiro** | `/financeiro` | Aba **Operacional** (lançamentos, pendências, formas de pagamento) e aba **Planejamento** (fluxo de caixa, divisão por meio, comissão de professores). |
| **Ranking / Torneio** | `/ranking` | Ranking geral e a chave da etapa em formato pirâmide, dividida em 4 categorias. |

A navegação principal fica na topbar. A Ficha do Aluno **não** é uma aba: abre ao
clicar no nome de um aluno na Agenda, no Financeiro, no Dashboard ou no Ranking.

---

## Legenda de cores da agenda

Definida com o cliente na Reunião Diagnóstica e aplicada exatamente assim em
`src/lib/theme.ts`:

| Cor | Tipo de alocação |
| --- | --- |
| 🔴 Vermelho | Individual |
| 🔵 Azul escuro | Locação Mensal |
| 🟢 Verde | Dupla |
| 🟠 Laranja | LAP |
| 🩵 Azul claro | Locação Avulsa |
| 🟣 Roxo | Ranking (reserva de quadra) |
| 🟡 Amarelo | Plano de locação |

Siglas de falta usadas na Ficha do Aluno: **CH** (chuva), **24h** (aviso prévio),
**FP** (falta do professor), **IAC** (Interesse Academia) e **TIP**
(Transferência / Interesse Professor).

---

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Login (única tela sem topbar)
│   ├── layout.tsx            # Providers e estilos globais
│   ├── globals.css           # Base do design system
│   └── (app)/                # Telas internas, com topbar
│       ├── layout.tsx
│       ├── dashboard/
│       ├── agenda/
│       ├── alunos/[id]/
│       ├── financeiro/
│       └── ranking/
├── components/
│   ├── layout/               # Topbar e logo
│   ├── ui/                   # Card, Badge, Avatar, StatCard, ícones…
│   ├── dashboard/            # Quadra em perspectiva 3D
│   ├── agenda/               # Grade semanal, mensal, chip de evento, legenda
│   ├── aluno/                # Blocos da ficha
│   ├── financeiro/           # Gráficos e tabelas
│   └── ranking/              # Pirâmide e lista
├── lib/
│   ├── types.ts              # Contrato de dados (base para o backend)
│   ├── mock-data.ts          # Todos os dados fictícios
│   ├── selectors.ts          # Camada de leitura (equivale aos endpoints)
│   ├── theme.ts              # Cores, siglas e formatadores
│   ├── date.ts               # Datas no fuso da arena
│   └── branding.ts           # Troca do logo
└── store/
    └── AppStore.tsx          # Estado em memória (comentários, congelamento, usuário)
```

Quem for construir o backend deve começar por
**[`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)**.

---

## Identidade visual

Paleta derivada do logo da Red Tennis, definida em `tailwind.config.ts`:

- **`saibro`** — laranja/terracota da quadra (cor primária)
- **`tijolo`** — vermelho escuro do letreiro (ações e alertas)
- **`areia`** — neutros quentes (fundos e textos)

O logo é desenhado em **SVG vetorial** (`src/components/layout/Logo.tsx`), o que
garante nitidez em qualquer tamanho e nenhuma dependência de rede.

### Usar o arquivo oficial do logo

1. Coloque a imagem em `public/` (ex.: `public/logo-red-tennis.webp`).
2. Em `src/lib/branding.ts`, troque `LOGO_OFICIAL` para o caminho do arquivo.

Todas as telas usam o mesmo componente — não é preciso alterar mais nada.

### Fotos dos alunos

Salve as fotos em `public/avatars/[id].jpg` (ex.: `public/avatars/a01.jpg`).
Enquanto o arquivo não existir, o componente `<Avatar>` mostra as iniciais do
aluno sobre uma cor estável derivada do id. Veja `public/avatars/README.md`.

---

## Dados fictícios

Gerados de forma **determinística** em `src/lib/mock-data.ts` — a demonstração
mostra sempre os mesmos dados, e as datas são ancoradas em "hoje" para que o
sistema pareça em uso em qualquer dia de apresentação.

- **20 alunos principais**, escritos à mão, com histórico completo — são também
  os 20 inscritos na etapa atual do ranking.
- **70 demais matriculados**, gerados a partir de listas de nomes, para que a
  grade semanal (≈ 200 horários) tenha um número plausível de pessoas.
  Todos têm ficha completa e navegável.
- **3 professores fixos**, conflitos de horário plantados de propósito e dias
  cancelados por chuva no calendário.

---

## O que está fora do escopo

Itens levantados na Reunião Diagnóstica que **não** fazem parte deste MVP:

- Integração real com Stone, Bradesco ou Total Pass (aqui são apenas representadas)
- Backend, banco de dados ou persistência de qualquer tipo
- Autenticação real (senha, sessão, permissão por cargo)
- Chaveamento automático do ranking e atualização da pirâmide por resultados
- Módulo de Estoque e Vendas internas
- Área do Cliente, site público e matrícula online
- Comandas (consumo no local)
- Geração real de relatórios em PDF/Excel — o botão "Exportar" é apenas visual

---

MVP desenvolvido pela **UFABC Júnior**. Dados fictícios, para demonstração.
