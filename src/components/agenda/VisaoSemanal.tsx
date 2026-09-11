"use client";

import { EventoChip } from "./EventoChip";
import { DIAS_SEMANA_CURTO, ORDEM_SEMANA, diaDaSemana, formatarDiaMes } from "@/lib/date";
import { FAIXAS_HORARIAS, HOJE } from "@/lib/mock-data";
import { choveuEm, horariosNaFaixaData, type FiltroAgenda } from "@/lib/selectors";

interface VisaoSemanalProps {
  /** Datas (segunda a domingo) da semana exibida. */
  datas: string[];
  filtro: FiltroAgenda;
}

/**
 * Grade semanal no estilo Google Calendar: dias da semana x faixas de 1h,
 * cobrindo o funcionamento da arena (07h as 22h).
 */
export function VisaoSemanal({ datas, filtro }: VisaoSemanalProps) {
  const umaQuadra = filtro.quadra !== undefined && filtro.quadra !== "todas";

  return (
    /**
     * A grade rola dentro do proprio cartao (vertical e horizontalmente), para
     * que filtros e legenda continuem visiveis e o cabecalho dos dias e a
     * coluna de horarios possam ficar fixos durante a navegacao.
     */
    <div className="max-h-[calc(100vh-25rem)] min-h-[26rem] overflow-auto rolagem-suave">
      <div className="min-w-[920px]">
        {/* Cabecalho dos dias */}
        <div
          className="sticky top-0 z-20 grid border-b border-areia-200 bg-white shadow-sm"
          style={{ gridTemplateColumns: "58px repeat(7, minmax(0, 1fr))" }}
        >
          <div className="sticky left-0 z-10 border-r border-areia-200 bg-white" />
          {ORDEM_SEMANA.map((dia, i) => {
            const data = datas[i];
            const ehHoje = data === HOJE;
            const chuva = choveuEm(data);
            return (
              <div
                key={dia}
                className={`border-r border-areia-200 px-2 py-2 text-center last:border-r-0 ${
                  ehHoje ? "bg-saibro-50" : ""
                }`}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-wide ${
                    ehHoje ? "text-saibro-700" : "text-areia-500"
                  }`}
                >
                  {DIAS_SEMANA_CURTO[dia]}
                </p>
                <p
                  className={`mt-0.5 text-sm font-semibold ${
                    ehHoje ? "text-saibro-800" : "text-areia-800"
                  }`}
                >
                  {formatarDiaMes(data)}
                </p>
                {chuva && (
                  <span className="mt-1 inline-block rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                    CH · chuva
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Faixas horarias */}
        <div>
          {FAIXAS_HORARIAS.map((faixa) => (
            <div
              key={faixa}
              className="grid border-b border-areia-200 last:border-b-0"
              style={{ gridTemplateColumns: "58px repeat(7, minmax(0, 1fr))" }}
            >
              <div className="sticky left-0 z-10 border-r border-areia-200 bg-white px-2 pt-1.5 text-right">
                <span className="text-[11px] font-medium tabular-nums text-areia-500">
                  {faixa}
                </span>
              </div>

              {ORDEM_SEMANA.map((dia, i) => {
                const data = datas[i];
                const ehHoje = data === HOJE;
                const passado = data < HOJE;
                const chuva = choveuEm(data);
                const eventos = horariosNaFaixaData(data, faixa, filtro);

                return (
                  <div
                    key={`${dia}-${faixa}`}
                    className={`min-h-[56px] border-r border-areia-200 p-1 last:border-r-0 ${
                      chuva
                        ? "bg-sky-50/70"
                        : ehHoje
                          ? "bg-saibro-50/40"
                          : passado
                            ? "bg-areia-50/60"
                            : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      {eventos.map((horario) => (
                        <EventoChip
                          key={horario.id}
                          horario={horario}
                          compacto={!umaQuadra}
                          passado={passado}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Dia da semana de hoje, exportado para destacar a coluna correspondente. */
export const DIA_DE_HOJE = diaDaSemana(HOJE);
