/**
 * ============================================================================
 *  SELETORES — camada de leitura dos dados
 * ============================================================================
 *  Toda a UI le dados atraves destas funcoes, nunca direto do mock. Cada
 *  funcao aqui corresponde, na pratica, a um endpoint que o backend precisara
 *  expor: trocar o import de `mock-data` por chamadas HTTP nao deve exigir
 *  mudanca nos componentes.
 * ============================================================================
 */

import {
  ALUNOS,
  DIAS_COM_CHUVA,
  IDS_INSCRITOS_RANKING,
  LINHAS_PIRAMIDE,
  FAIXAS_HORARIAS,
  HOJE,
  HORARIOS,
  MENSALIDADE_POR_ALUNO,
  PAGAMENTOS,
  PROFESSORES,
  QUADRAS,
  SEM_PROFESSOR,
} from "./mock-data";
import { diaDaSemana, diferencaEmDias, horaParaMinutos, somarDias } from "./date";
import type {
  Aluno,
  CategoriaRanking,
  FormaPagamento,
  Horario,
  Pagamento,
  Professor,
  Quadra,
  TipoAlocacao,
} from "./types";

// ---------------------------------------------------------------------------
// Alunos
// ---------------------------------------------------------------------------
export function listarAlunos(): Aluno[] {
  return ALUNOS;
}

export function buscarAluno(id: string): Aluno | undefined {
  return ALUNOS.find((a) => a.id === id);
}

export function nomeDoAluno(id: string): string {
  return buscarAluno(id)?.nome ?? "Aluno removido";
}

/** "Ana Beatriz Moraes" -> "Ana B. Moraes" (usado nos chips da agenda). */
export function nomeCompacto(nomeCompleto: string): string {
  const partes = nomeCompleto.split(" ");
  if (partes.length <= 2) return nomeCompleto;
  return `${partes[0]} ${partes[partes.length - 1]}`;
}

// ---------------------------------------------------------------------------
// Professores
// ---------------------------------------------------------------------------
export function listarProfessores(): Professor[] {
  return PROFESSORES;
}

export function buscarProfessorPorNome(nome: string): Professor | undefined {
  return PROFESSORES.find((p) => p.nome === nome);
}

// ---------------------------------------------------------------------------
// Agenda
// ---------------------------------------------------------------------------
export interface FiltroAgenda {
  quadra?: Quadra | "todas";
  professor?: string | "todos";
  tipo?: TipoAlocacao | "todos";
}

export function listarHorarios(filtro: FiltroAgenda = {}): Horario[] {
  const { quadra = "todas", professor = "todos", tipo = "todos" } = filtro;

  return HORARIOS.filter((h) => {
    if (quadra !== "todas" && h.quadra !== quadra) return false;
    if (professor !== "todos" && h.professor !== professor) return false;
    if (tipo !== "todos" && h.tipo !== tipo) return false;
    return true;
  });
}

/** Horarios de um dia da semana (0 = domingo), ordenados por hora de inicio. */
export function horariosDoDia(
  diaSemana: number,
  filtro: FiltroAgenda = {},
): Horario[] {
  return listarHorarios(filtro)
    .filter((h) => h.diaSemana === diaSemana)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

/** Horarios que comecam exatamente na faixa informada, num dado dia. */
export function horariosNaFaixa(
  diaSemana: number,
  faixa: string,
  filtro: FiltroAgenda = {},
): Horario[] {
  return horariosDoDia(diaSemana, filtro)
    .filter((h) => h.horaInicio === faixa)
    .sort((a, b) => String(a.quadra).localeCompare(String(b.quadra)));
}

/** A arena e toda descoberta: em dia de chuva nao ha operacao. */
export function choveuEm(data: string): boolean {
  return DIAS_COM_CHUVA.includes(data);
}

/**
 * Horarios de uma data real.
 * Parte da grade fixa do dia da semana e aplica as excecoes daquela data
 * (hoje, apenas os dias cancelados por chuva).
 */
export function horariosDaData(
  data: string,
  filtro: FiltroAgenda = {},
): Horario[] {
  if (choveuEm(data)) return [];
  return horariosDoDia(diaDaSemana(data), filtro);
}

/** Horarios de uma data real que comecam na faixa informada. */
export function horariosNaFaixaData(
  data: string,
  faixa: string,
  filtro: FiltroAgenda = {},
): Horario[] {
  if (choveuEm(data)) return [];
  return horariosNaFaixa(diaDaSemana(data), faixa, filtro);
}

export function contarConflitos(filtro: FiltroAgenda = {}): number {
  return listarHorarios(filtro).filter((h) => h.temConflito).length;
}

/** Duracao do horario em minutos. */
export function duracaoHorario(horario: Horario): number {
  return horaParaMinutos(horario.horaFim) - horaParaMinutos(horario.horaInicio);
}

// ---------------------------------------------------------------------------
// Ocupacao das quadras (Dashboard)
// ---------------------------------------------------------------------------
export interface OcupacaoQuadra {
  quadra: Quadra;
  /** Numero de horarios marcados no dia. */
  ocupados: number;
  /** Total de faixas disponiveis no dia (07h as 22h). */
  total: number;
  /** Razao 0..1 usada para escurecer a quadra no Dashboard. */
  taxa: number;
  /** Proximo horario ainda livre, ou null se a quadra estiver lotada. */
  proximaFaixaLivre: string | null;
  /** Proximo compromisso do dia a partir de agora. */
  proximoHorario: Horario | null;
  conflitos: number;
}

/**
 * Ocupacao de cada quadra em um dia da semana.
 * `referencia` permite calcular a ocupacao de qualquer dia; por padrao, hoje.
 */
export function ocupacaoDasQuadras(referencia: string = HOJE): OcupacaoQuadra[] {
  const dia = diaDaSemana(referencia);
  const total = FAIXAS_HORARIAS.length;

  return QUADRAS.map((quadra) => {
    const doDia = horariosDoDia(dia, { quadra });
    const ocupadas = new Set(doDia.map((h) => h.horaInicio));
    const livre = FAIXAS_HORARIAS.find((f) => !ocupadas.has(f)) ?? null;

    return {
      quadra,
      ocupados: ocupadas.size,
      total,
      taxa: ocupadas.size / total,
      proximaFaixaLivre: livre,
      proximoHorario: doDia[0] ?? null,
      conflitos: doDia.filter((h) => h.temConflito).length,
    };
  });
}

export interface ResumoDoDia {
  aulasHoje: number;
  alunosEmQuadra: number;
  taxaOcupacaoMedia: number;
  conflitos: number;
  quadraMaisCheia: Quadra;
}

export function resumoDoDia(referencia: string = HOJE): ResumoDoDia {
  const dia = diaDaSemana(referencia);
  const doDia = horariosDoDia(dia);
  const ocupacoes = ocupacaoDasQuadras(referencia);
  const maisCheia = [...ocupacoes].sort((a, b) => b.taxa - a.taxa)[0];

  return {
    aulasHoje: doDia.length,
    alunosEmQuadra: new Set(doDia.flatMap((h) => h.alunosIds)).size,
    taxaOcupacaoMedia:
      ocupacoes.reduce((soma, o) => soma + o.taxa, 0) / ocupacoes.length,
    conflitos: doDia.filter((h) => h.temConflito).length,
    quadraMaisCheia: maisCheia.quadra,
  };
}

// ---------------------------------------------------------------------------
// Financeiro
// ---------------------------------------------------------------------------
export function listarPagamentos(): Pagamento[] {
  return PAGAMENTOS;
}

export interface FiltroFinanceiro {
  status?: "todos" | "confirmado" | "pendente";
  forma?: FormaPagamento | "todas";
  busca?: string;
}

export function filtrarPagamentos(filtro: FiltroFinanceiro = {}): Pagamento[] {
  const { status = "todos", forma = "todas", busca = "" } = filtro;
  const termo = busca.trim().toLowerCase();

  return PAGAMENTOS.filter((p) => {
    if (status !== "todos" && p.status !== status) return false;
    if (forma !== "todas" && p.formaPagamento !== forma) return false;
    if (termo) {
      const alvo = `${nomeDoAluno(p.alunoId)} ${p.nomePagante} ${p.item}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    return true;
  });
}

export interface ResumoFinanceiro {
  recebidoNoMes: number;
  aReceber: number;
  emAtraso: number;
  quantidadeEmAtraso: number;
  cobertoTotalPass: number;
  complementoTotalPass: number;
  ticketMedio: number;
}

export function resumoFinanceiro(referencia: string = HOJE): ResumoFinanceiro {
  const mes = referencia.slice(0, 7);
  const doMes = PAGAMENTOS.filter((p) => p.data.slice(0, 7) === mes);

  const confirmados = doMes.filter((p) => p.status === "confirmado");
  const pendentes = PAGAMENTOS.filter((p) => p.status === "pendente");
  const atrasados = pendentes.filter((p) => p.diasEmAtraso > 0);

  const comTotalPass = PAGAMENTOS.filter(
    (p) => p.formaPagamento === "Total Pass" && p.data.slice(0, 7) === mes,
  );

  return {
    recebidoNoMes: confirmados.reduce((s, p) => s + p.valor, 0),
    aReceber: pendentes.reduce((s, p) => s + p.valor, 0),
    emAtraso: atrasados.reduce((s, p) => s + p.valor, 0),
    quantidadeEmAtraso: atrasados.length,
    cobertoTotalPass: comTotalPass.reduce((s, p) => s + (p.valorTotalPass ?? 0), 0),
    complementoTotalPass: comTotalPass.reduce(
      (s, p) => s + (p.valor - (p.valorTotalPass ?? 0)),
      0,
    ),
    ticketMedio: confirmados.length
      ? confirmados.reduce((s, p) => s + p.valor, 0) / confirmados.length
      : 0,
  };
}

export interface EntradaFluxoCaixa {
  data: string;
  recebido: number;
  previsto: number;
}

/**
 * Fluxo de caixa dos ultimos `dias` dias, separando o que ja entrou do que
 * ainda esta previsto (boleto em aberto, credito a compensar, repasse Total Pass).
 */
export function fluxoDeCaixa(
  dias = 21,
  referencia: string = HOJE,
): EntradaFluxoCaixa[] {
  return Array.from({ length: dias }, (_, i) => {
    const data = somarDias(referencia, -(dias - 1 - i));
    const doDia = PAGAMENTOS.filter((p) => p.data === data);

    return {
      data,
      recebido: doDia
        .filter((p) => p.status === "confirmado")
        .reduce((s, p) => s + p.valor, 0),
      previsto: doDia
        .filter((p) => p.status === "pendente")
        .reduce((s, p) => s + p.valor, 0),
    };
  });
}

export interface TotalPorForma {
  forma: FormaPagamento;
  total: number;
  quantidade: number;
  participacao: number;
}

export function totaisPorForma(referencia: string = HOJE): TotalPorForma[] {
  const mes = referencia.slice(0, 7);
  const doMes = PAGAMENTOS.filter((p) => p.data.slice(0, 7) === mes);
  const geral = doMes.reduce((s, p) => s + p.valor, 0) || 1;

  const formas: FormaPagamento[] = ["Stone", "Bradesco", "Total Pass", "Dinheiro"];

  return formas
    .map((forma) => {
      const itens = doMes.filter((p) => p.formaPagamento === forma);
      const total = itens.reduce((s, p) => s + p.valor, 0);
      return {
        forma,
        total,
        quantidade: itens.length,
        participacao: total / geral,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export interface ResumoProfessor {
  professor: Professor;
  aulasSemana: number;
  alunosAtendidos: number;
  horasSemana: number;
  comissaoSemana: number;
  comissaoMes: number;
}

/**
 * Resumo agregado de comissao dos professores.
 * Nao e um modulo de folha de pagamento — e o panorama que o gestor pediu
 * para saber quanto sai por professor no fechamento.
 */
export function resumoProfessores(): ResumoProfessor[] {
  return PROFESSORES.map((professor) => {
    const aulas = HORARIOS.filter((h) => h.professor === professor.nome);
    const horas = aulas.reduce((s, h) => s + duracaoHorario(h) / 60, 0);

    return {
      professor,
      aulasSemana: aulas.length,
      alunosAtendidos: new Set(aulas.flatMap((h) => h.alunosIds)).size,
      horasSemana: horas,
      comissaoSemana: horas * professor.valorHoraAula,
      comissaoMes: horas * professor.valorHoraAula * 4.3,
    };
  }).sort((a, b) => b.comissaoMes - a.comissaoMes);
}

/** Receita recorrente contratada (soma das mensalidades ativas). */
export function receitaRecorrente(): number {
  return ALUNOS.filter((a) => !a.planoCongelado).reduce(
    (s, a) => s + (MENSALIDADE_POR_ALUNO[a.id] ?? 0),
    0,
  );
}

/** Reservas confirmadas na agenda que ainda estao sem pagamento quitado. */
export function reservasSemPagamento(): Pagamento[] {
  return PAGAMENTOS.filter(
    (p) => p.status === "pendente" && p.diasEmAtraso > 0,
  ).sort((a, b) => b.diasEmAtraso - a.diasEmAtraso);
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------
export function rankingGeral(): Aluno[] {
  return [...ALUNOS].sort((a, b) => b.rankingPontuacao - a.rankingPontuacao);
}

export function rankingPorCategoria(categoria: CategoriaRanking): Aluno[] {
  return rankingGeral().filter((a) => a.categoriaRanking === categoria);
}

export interface PosicaoPiramide {
  posicao: number;
  aluno: Aluno;
}

/**
 * Piramide da etapa atual do ranking.
 *
 * Disputam a etapa os 20 inscritos; os demais matriculados continuam
 * pontuando no ranking geral e entram nas proximas etapas.
 */
export function piramideDaEtapa(): PosicaoPiramide[][] {
  return montarPiramide(LINHAS_PIRAMIDE, inscritosNoRanking());
}

export function inscritosNoRanking(): Aluno[] {
  return rankingGeral().filter((a) => IDS_INSCRITOS_RANKING.includes(a.id));
}

/** Distribui uma lista ordenada nas faixas da piramide, do topo para a base. */
export function montarPiramide(
  linhas: number[],
  jogadores: Aluno[] = rankingGeral(),
): PosicaoPiramide[][] {
  const ordenados = jogadores;
  const faixas: PosicaoPiramide[][] = [];
  let cursor = 0;

  linhas.forEach((tamanho) => {
    const faixa: PosicaoPiramide[] = [];
    for (let i = 0; i < tamanho && cursor < ordenados.length; i += 1) {
      faixa.push({ posicao: cursor + 1, aluno: ordenados[cursor] });
      cursor += 1;
    }
    faixas.push(faixa);
  });

  return faixas;
}

// ---------------------------------------------------------------------------
// Ficha do aluno
// ---------------------------------------------------------------------------
export interface ResumoAluno {
  aulasRealizadas: number;
  faltas: number;
  reagendadas: number;
  frequencia: number;
  temDireitoReagendamento: boolean;
  diasParaVencerSaldo: number;
  totalPago: number;
  emAberto: number;
  proximoHorario: Horario | null;
}

export function resumoAluno(aluno: Aluno): ResumoAluno {
  const realizadas = aluno.historicoAulas.filter(
    (a) => a.status === "realizada",
  ).length;
  const faltas = aluno.historicoAulas.filter((a) => a.status === "falta").length;
  const reagendadas = aluno.historicoAulas.filter(
    (a) => a.status === "reagendada",
  ).length;

  const proximos = HORARIOS.filter(
    (h) => h.alunosIds.includes(aluno.id) && h.professor !== SEM_PROFESSOR,
  ).sort((a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio));

  return {
    aulasRealizadas: realizadas,
    faltas,
    reagendadas,
    frequencia: aluno.historicoAulas.length
      ? realizadas / aluno.historicoAulas.length
      : 0,
    temDireitoReagendamento: aluno.saldoMinutosReposicao > 0,
    diasParaVencerSaldo: diferencaEmDias(HOJE, aluno.validadeReposicao),
    totalPago: aluno.historicoPagamentos
      .filter((p) => p.status === "confirmado")
      .reduce((s, p) => s + p.valor, 0),
    emAberto: aluno.historicoPagamentos
      .filter((p) => p.status === "pendente")
      .reduce((s, p) => s + p.valor, 0),
    proximoHorario: proximos[0] ?? null,
  };
}

/** Horarios fixos do aluno na grade semanal. */
export function horariosDoAluno(alunoId: string): Horario[] {
  return HORARIOS.filter((h) => h.alunosIds.includes(alunoId)).sort(
    (a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio),
  );
}
