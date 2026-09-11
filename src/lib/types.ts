/**
 * Contrato de dados do MVP Red Tennis.
 *
 * Este arquivo e a referencia para a equipe que for construir o backend:
 * cada tipo aqui corresponde a uma entidade que precisara existir na API.
 * O MVP consome esses tipos a partir de `mock-data.ts` (dados estaticos em
 * memoria) e os le exclusivamente atraves de `selectors.ts` — trocar o mock
 * por chamadas HTTP reais nao deve exigir mudanca nos componentes.
 */

/** Quadras de saibro (1 a 4) + paredao. */
export type Quadra = 1 | 2 | 3 | 4 | "paredao";

/** Tipos de alocacao de horario — definem a cor do evento na Agenda. */
export type TipoAlocacao =
  | "Individual"
  | "Locação Mensal"
  | "Dupla"
  | "LAP"
  | "Locação Avulsa"
  | "Ranking"
  | "Plano de locação";

/** Planos comerciais que um aluno pode contratar. */
export type PlanoAluno =
  | "Individual"
  | "Dupla"
  | "Locação Mensal"
  | "Locação Avulsa"
  | "LAP";

/**
 * Motivos de falta / reagendamento, com as siglas usadas pela Red Tennis:
 *  - CH             : chuva
 *  - aviso_24h      : aluno avisou com no minimo 24h de antecedencia
 *  - falta_professor: ausencia do professor
 *  - IAC            : Interesse Academia
 *  - TIP            : Transferencia / Interesse Professor
 */
export type MotivoFalta =
  | "CH"
  | "aviso_24h"
  | "falta_professor"
  | "IAC"
  | "TIP";

export type StatusAula = "realizada" | "falta" | "reagendada";

export type FormaPagamento =
  | "Stone"
  | "Bradesco"
  | "Total Pass"
  | "Dinheiro";

export type StatusPagamento = "confirmado" | "pendente";

/** Categorias do ranking, do topo (A) para a base (D) da piramide. */
export type CategoriaRanking = "A" | "B" | "C" | "D";

export interface HistoricoAula {
  data: string; // ISO (YYYY-MM-DD)
  quadra: Quadra;
  professor: string;
  horario: string; // "HH:mm"
  status: StatusAula;
  motivoFalta?: MotivoFalta;
  /** Minutos creditados no saldo de reposicao por esta ocorrencia. */
  minutosRepostos?: number;
}

export interface Pagamento {
  id: string;
  alunoId: string;
  data: string; // ISO (YYYY-MM-DD) — data do lancamento
  /** Data de entrada efetiva do dinheiro (pode ser futura: boleto, D+30 etc.). */
  dataCompensacao: string;
  nomePagante: string; // pode ser diferente do aluno (pai, empresa, conjuge)
  item: string;
  valor: number;
  formaPagamento: FormaPagamento;
  status: StatusPagamento;
  /** Parcela coberta pelo Total Pass — o complemento e `valor - valorTotalPass`. */
  valorTotalPass?: number;
  /** true quando pagamento e lista de participantes ja foram conferidos. */
  participantesConfirmados: boolean;
  /** Dias de atraso em relacao ao prazo acordado (0 quando em dia). */
  diasEmAtraso: number;
}

export interface Comentario {
  id: string;
  data: string; // ISO (YYYY-MM-DDTHH:mm)
  autor: string;
  texto: string;
}

export interface Aluno {
  id: string;
  nome: string;
  /** Caminho em /public/avatars/[id].jpg — cai no placeholder de iniciais se ausente. */
  avatarUrl?: string;
  telefone: string;
  email: string;
  plano: PlanoAluno;
  dataInicio: string; // ISO (YYYY-MM-DD)
  professorPrincipal: string;
  /** Saldo de reposicao contabilizado em MINUTOS (validade de 3 meses). */
  saldoMinutosReposicao: number;
  /** Vencimento do saldo de reposicao acima. */
  validadeReposicao: string; // ISO (YYYY-MM-DD)
  planoCongelado: boolean;
  motivoCongelamento?: string;
  rankingPontuacao: number;
  categoriaRanking: CategoriaRanking;
  /** Variacao de posicao no ranking desde a ultima apuracao. */
  variacaoRanking: number;
  historicoAulas: HistoricoAula[];
  historicoPagamentos: Pagamento[];
  comentarios: Comentario[];
}

export interface Horario {
  id: string;
  quadra: Quadra;
  /** 0 = domingo ... 6 = sabado (mesma convencao de Date.getDay()). */
  diaSemana: number;
  horaInicio: string; // "HH:mm"
  horaFim: string; // "HH:mm"
  tipo: TipoAlocacao;
  alunosIds: string[];
  professor: string;
  /** Marcado pelo seletor `detectarConflitos` quando ha sobreposicao na mesma quadra. */
  temConflito?: boolean;
}

export interface Professor {
  id: string;
  nome: string;
  cor: string; // cor de apoio usada nos filtros da agenda
  especialidade: string;
  valorHoraAula: number;
}

export interface Torneio {
  id: string;
  nome: string;
  data: string; // ISO (YYYY-MM-DD)
  formato: string;
  inscritos: number;
  status: "inscrições abertas" | "em andamento" | "encerrado";
}
