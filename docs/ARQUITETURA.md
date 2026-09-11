# Arquitetura e handoff para o backend

Documento para a equipe que for construir o backend em cima deste front-end.

## Princípio

Nenhum componente lê dados diretamente do mock. Toda leitura passa por
`src/lib/selectors.ts`. Essa camada existe justamente para ser trocada:

```
Componentes  →  selectors.ts  →  mock-data.ts        (hoje)
Componentes  →  selectors.ts  →  fetch/API           (depois)
```

Trocar o mock por chamadas HTTP reais **não deve exigir mudança nos
componentes** — apenas na implementação das funções de `selectors.ts` (e na
transformação delas em funções assíncronas).

## Contrato de dados

`src/lib/types.ts` é a referência das entidades. Resumo:

| Tipo | Descrição | Observações |
| --- | --- | --- |
| `Aluno` | Cadastro completo | Inclui histórico de aulas, pagamentos e comentários |
| `Horario` | Alocação na grade semanal | Usa `diaSemana` (0 = domingo), não data absoluta |
| `Pagamento` | Lançamento financeiro | Tem `data` (lançamento) e `dataCompensacao` (entrada no caixa) |
| `HistoricoAula` | Ocorrência de aula | `status` + `motivoFalta` + `minutosRepostos` |
| `Comentario` | Nota do gestor na ficha | Data e autor |
| `Professor` | Professor da arena | Inclui `valorHoraAula` para o cálculo de comissão |
| `Torneio` | Etapa do ranking | |

### Decisões do modelo que valem discutir antes de implementar

1. **A grade é semanal e recorrente.** `Horario` guarda `diaSemana`, não uma
   data. É como a arena opera (horários fixos), mas o backend vai precisar de
   uma camada de **exceções por data** — cancelamento, reagendamento pontual,
   feriado. O MVP já demonstra o conceito com os dias cancelados por chuva
   (`DIAS_COM_CHUVA` + `horariosDaData`).

2. **Saldo de reposição em minutos.** Não em aulas. Validade de 3 meses
   (`validadeReposicao`). O crédito nasce de um `motivoFalta` que dá direito
   (CH, aviso 24h, falta do professor, TIP).

3. **Pagante pode ser diferente do aluno.** `Pagamento.nomePagante` é campo
   próprio — no futuro provavelmente vira uma referência a um "responsável
   financeiro".

4. **Total Pass tem duas parcelas.** `valor` é o total e `valorTotalPass` é a
   parte coberta pelo convênio; o complemento é a diferença.

5. **Conflito é derivado, não armazenado.** `temConflito` é calculado por
   sobreposição na mesma quadra (`marcarConflitos` em `mock-data.ts`). No
   backend, a regra deveria impedir o conflito na escrita — e a UI continua
   sinalizando os que existirem.

## Seletores e os endpoints correspondentes

| Seletor | Endpoint sugerido |
| --- | --- |
| `listarAlunos()` / `buscarAluno(id)` | `GET /alunos`, `GET /alunos/:id` |
| `listarHorarios(filtro)` | `GET /horarios?quadra&professor&tipo` |
| `horariosDaData(data, filtro)` | `GET /agenda?data=` |
| `ocupacaoDasQuadras(data)` | `GET /quadras/ocupacao?data=` |
| `resumoDoDia(data)` | `GET /dashboard/resumo?data=` |
| `filtrarPagamentos(filtro)` | `GET /pagamentos?status&forma&busca` |
| `resumoFinanceiro(data)` | `GET /financeiro/resumo?mes=` |
| `fluxoDeCaixa(dias)` | `GET /financeiro/fluxo-caixa?dias=` |
| `totaisPorForma(data)` | `GET /financeiro/formas-pagamento?mes=` |
| `resumoProfessores()` | `GET /professores/comissoes` |
| `rankingGeral()` / `piramideDaEtapa()` | `GET /ranking`, `GET /ranking/etapa-atual` |
| `resumoAluno(aluno)` | `GET /alunos/:id/resumo` |

Escritas que o protótipo simula em memória (`src/store/AppStore.tsx`) e que
viram endpoints:

| Ação na UI | Endpoint sugerido |
| --- | --- |
| Adicionar observação na ficha | `POST /alunos/:id/comentarios` |
| Congelar / reativar plano | `PATCH /alunos/:id/plano` |
| Login do colaborador | `POST /auth/login` |

## Estado da aplicação

`src/store/AppStore.tsx` guarda o que o usuário altera durante a demonstração:
usuário logado, novos comentários e o congelamento de planos. Tudo volta ao
estado inicial a cada reload. É o ponto natural para trocar `useState` por
chamadas reais (ou por um cliente de dados como React Query).

## Datas

`src/lib/date.ts` resolve todas as datas no fuso da arena
(`America/Sao_Paulo`), independentemente do fuso da máquina. Isso mantém o valor
de "hoje" idêntico no servidor e no cliente e evita divergência de hidratação.
As telas internas rodam sob demanda (`export const dynamic = "force-dynamic"` em
`src/app/(app)/layout.tsx`) para que um HTML gerado no build não congele a data.

## Estilo e acessibilidade

- Design tokens em `tailwind.config.ts` (`saibro`, `tijolo`, `areia`) e
  `src/lib/theme.ts` (cores por tipo de alocação, siglas, formatadores).
- As cores das séries dos gráficos do Financeiro foram validadas para daltonismo
  (separação CVD ≥ 8 entre todos os pares, sobre fundo claro) e cada barra tem
  rótulo direto, para que a leitura não dependa da cor.
- O fluxo de caixa distingue "recebido" de "previsto" por **cor e hachura**, e
  oferece os mesmos dados em tabela.
- Nenhuma fonte externa é carregada: o projeto roda offline.
