"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CabecalhoAluno } from "@/components/aluno/CabecalhoAluno";
import { Comentarios } from "@/components/aluno/Comentarios";
import { HistoricoAulas } from "@/components/aluno/HistoricoAulas";
import { HistoricoPagamentos } from "@/components/aluno/HistoricoPagamentos";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import {
  IconeAgenda,
  IconeAlerta,
  IconeCheck,
  IconeRelogio,
  IconeTrofeu,
} from "@/components/ui/Icons";
import { DIAS_SEMANA_CURTO, formatarData } from "@/lib/date";
import { horariosDoAluno, resumoAluno } from "@/lib/selectors";
import {
  ESTILO_TIPO,
  formatarMinutos,
  formatarMoeda,
  rotuloQuadra,
} from "@/lib/theme";
import { useApp } from "@/store/AppStore";

export default function PaginaFichaAluno() {
  const parametros = useParams<{ id: string }>();
  const { obterAluno, adicionarComentario, alternarCongelamento } = useApp();

  const aluno = obterAluno(parametros.id);

  if (!aluno) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-areia-600">Aluno não encontrado.</p>
        <Link href="/agenda" className="btn-secundario mt-4">
          Voltar para a agenda
        </Link>
      </Card>
    );
  }

  const resumo = resumoAluno(aluno);
  const fixos = horariosDoAluno(aluno.id);

  return (
    <div className="space-y-6">
      <CabecalhoAluno
        aluno={aluno}
        aoAlternarCongelamento={() => alternarCongelamento(aluno.id)}
      />

      {/* Indicadores do aluno */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          rotulo="Aulas realizadas"
          valor={String(resumo.aulasRealizadas)}
          detalhe={`${Math.round(resumo.frequencia * 100)}% de frequência no período`}
          icone={<IconeCheck className="h-5 w-5" />}
          tom="positivo"
        />
        <StatCard
          rotulo="Faltas e reagendamentos"
          valor={`${resumo.faltas} / ${resumo.reagendadas}`}
          detalhe="Faltas / aulas reagendadas"
          icone={<IconeAlerta className="h-5 w-5" />}
        />
        <StatCard
          rotulo="Total pago"
          valor={formatarMoeda(resumo.totalPago)}
          detalhe={
            resumo.emAberto > 0
              ? `${formatarMoeda(resumo.emAberto)} em aberto`
              : "Nenhuma pendência"
          }
          icone={<IconeCheck className="h-5 w-5" />}
          tom={resumo.emAberto > 0 ? "alerta" : "neutro"}
        />
        <StatCard
          rotulo="Pontuação no ranking"
          valor={String(aluno.rankingPontuacao)}
          detalhe={`Categoria ${aluno.categoriaRanking} · ${
            aluno.variacaoRanking > 0
              ? `subiu ${aluno.variacaoRanking}`
              : aluno.variacaoRanking < 0
                ? `caiu ${Math.abs(aluno.variacaoRanking)}`
                : "estável"
          }`}
          icone={<IconeTrofeu className="h-5 w-5" />}
          tom="saibro"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <HistoricoAulas aulas={aluno.historicoAulas} />
          <HistoricoPagamentos pagamentos={aluno.historicoPagamentos} />
        </div>

        <div className="min-w-0 space-y-6">
          {/* Saldo de reposicao */}
          <Card>
            <CardHeader
              titulo="Reposição"
              descricao="Crédito contabilizado em minutos, com validade de 3 meses."
              icone={<IconeRelogio className="h-5 w-5" />}
            />
            <div className="space-y-3 p-5">
              <div className="rounded-xl border border-saibro-200 bg-saibro-50/70 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-saibro-700">
                  Saldo disponível
                </p>
                <p className="mt-1 text-3xl font-bold text-saibro-800">
                  {formatarMinutos(aluno.saldoMinutosReposicao)}
                </p>
                <p className="mt-1 text-xs text-saibro-700/80">
                  {aluno.saldoMinutosReposicao} minutos acumulados
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-areia-600">Direito a reagendamento</span>
                {resumo.temDireitoReagendamento ? (
                  <Badge cor="#15803D" fundo="#F0FDF4">
                    <IconeCheck className="h-3.5 w-3.5" />
                    Liberado
                  </Badge>
                ) : (
                  <Badge cor="#6B6255" fundo="#F4F1EC">
                    Sem saldo
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-areia-600">Validade do saldo</span>
                <span className="font-medium text-areia-800">
                  {formatarData(aluno.validadeReposicao)}
                </span>
              </div>

              {resumo.temDireitoReagendamento && (
                <p
                  className={`rounded-lg px-3 py-2 text-xs ${
                    resumo.diasParaVencerSaldo <= 30
                      ? "bg-tijolo-50 text-tijolo-700"
                      : "bg-areia-100 text-areia-600"
                  }`}
                >
                  {resumo.diasParaVencerSaldo <= 30
                    ? `Atenção: o saldo vence em ${resumo.diasParaVencerSaldo} dias.`
                    : `Vence em ${resumo.diasParaVencerSaldo} dias.`}
                </p>
              )}
            </div>
          </Card>

          {/* Horarios fixos na grade */}
          <Card>
            <CardHeader
              titulo="Horários fixos"
              descricao="Presença do aluno na grade semanal."
              icone={<IconeAgenda className="h-5 w-5" />}
            />
            <ul className="divide-y divide-areia-100">
              {fixos.map((horario) => {
                const estilo = ESTILO_TIPO[horario.tipo];
                return (
                  <li key={horario.id} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className="h-8 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: estilo.cor }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-areia-900">
                        {DIAS_SEMANA_CURTO[horario.diaSemana]} ·{" "}
                        {horario.horaInicio}–{horario.horaFim}
                      </p>
                      <p className="truncate text-xs text-areia-500">
                        {rotuloQuadra(horario.quadra)} · {horario.professor}
                      </p>
                    </div>
                    <Badge
                      cor={estilo.texto}
                      fundo={estilo.fundo}
                      borda={estilo.borda}
                      className="shrink-0 text-[11px]"
                    >
                      {horario.tipo}
                    </Badge>
                  </li>
                );
              })}

              {fixos.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-areia-500">
                  {aluno.planoCongelado
                    ? "Plano congelado — sem horários na grade atual."
                    : "Nenhum horário fixo na grade."}
                </li>
              )}
            </ul>
          </Card>

          <Comentarios
            comentarios={aluno.comentarios}
            aoAdicionar={(texto) => adicionarComentario(aluno.id, texto)}
          />
        </div>
      </div>
    </div>
  );
}
