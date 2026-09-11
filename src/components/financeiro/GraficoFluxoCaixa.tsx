"use client";

import { useState } from "react";
import { formatarDiaMes } from "@/lib/date";
import { COR_PREVISTO, COR_RECEBIDO, formatarMoeda } from "@/lib/theme";
import type { EntradaFluxoCaixa } from "@/lib/selectors";

/**
 * Fluxo de caixa diario.
 *
 * Barras empilhadas de um mesmo matiz em dois passos: a parte cheia e o que ja
 * entrou no caixa; a parte hachurada e o que esta previsto (boleto em aberto,
 * credito a compensar, repasse do convenio). Um so eixo de valor.
 */
export function GraficoFluxoCaixa({ dados }: { dados: EntradaFluxoCaixa[] }) {
  const [ativo, setAtivo] = useState<number | null>(null);

  const maximo = Math.max(...dados.map((d) => d.recebido + d.previsto), 1);
  const totalRecebido = dados.reduce((s, d) => s + d.recebido, 0);
  const totalPrevisto = dados.reduce((s, d) => s + d.previsto, 0);

  // Rotulo direto apenas no dia de maior movimento — nunca em todas as barras.
  const indiceMaior = dados.reduce(
    (melhor, d, i) =>
      d.recebido + d.previsto > dados[melhor].recebido + dados[melhor].previsto
        ? i
        : melhor,
    0,
  );

  const linhas = [0.25, 0.5, 0.75, 1];

  return (
    <div>
      {/* Legenda — sempre presente por haver duas séries */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Item cor={COR_RECEBIDO} rotulo="Já recebido" valor={totalRecebido} />
        <Item
          cor={COR_PREVISTO}
          rotulo="Previsto / em compensação"
          valor={totalPrevisto}
          hachurado
        />
      </div>

      {/* pl-16 reserva a calha do eixo de valores, fora da área das barras */}
      <div className="relative pl-16">
        {/* Grade de referência, recessiva */}
        <div className="pointer-events-none absolute bottom-6 left-16 right-0 top-0">
          {linhas.map((fracao) => (
            <div
              key={fracao}
              className="absolute inset-x-0 border-t border-dashed border-areia-200"
              style={{ bottom: `${fracao * 100}%` }}
            >
              <span className="absolute -left-16 -top-2 w-14 text-right text-[10px] tabular-nums text-areia-400">
                {formatarMoeda(maximo * fracao).replace(",00", "")}
              </span>
            </div>
          ))}
        </div>

        <div className="relative flex h-56 items-end gap-[3px]">
          {dados.map((dia, i) => {
            const total = dia.recebido + dia.previsto;
            const alturaRecebido = (dia.recebido / maximo) * 100;
            const alturaPrevisto = (dia.previsto / maximo) * 100;
            const destacado = ativo === i;

            return (
              <div
                key={dia.data}
                className="group relative flex h-full flex-1 flex-col justify-end"
                onMouseEnter={() => setAtivo(i)}
                onMouseLeave={() => setAtivo(null)}
                onFocus={() => setAtivo(i)}
                onBlur={() => setAtivo(null)}
                tabIndex={0}
                role="img"
                aria-label={`${formatarDiaMes(dia.data)}: recebido ${formatarMoeda(
                  dia.recebido,
                )}, previsto ${formatarMoeda(dia.previsto)}`}
              >
                {/* Rótulo direto no dia de maior movimento */}
                {i === indiceMaior && total > 0 && (
                  <span
                    className="absolute inset-x-0 text-center text-[10px] font-semibold text-areia-600"
                    style={{ bottom: `calc(${(total / maximo) * 100}% + 26px)` }}
                  >
                    {formatarMoeda(total).replace(",00", "")}
                  </span>
                )}

                <div className="flex flex-col justify-end pb-6" style={{ height: "100%" }}>
                  {alturaPrevisto > 0 && (
                    <div
                      className="rounded-t-[4px] transition-opacity"
                      style={{
                        height: `${alturaPrevisto}%`,
                        backgroundColor: COR_PREVISTO,
                        // Hachura: segunda codificação além da cor
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(255,255,255,0.75) 0 2px, transparent 2px 5px)",
                        opacity: ativo === null || destacado ? 1 : 0.45,
                        // Respiro de 2px entre os segmentos empilhados
                        marginBottom: alturaRecebido > 0 ? 2 : 0,
                      }}
                    />
                  )}
                  {alturaRecebido > 0 && (
                    <div
                      className={`transition-opacity ${
                        alturaPrevisto > 0 ? "" : "rounded-t-[4px]"
                      }`}
                      style={{
                        height: `${alturaRecebido}%`,
                        backgroundColor: COR_RECEBIDO,
                        opacity: ativo === null || destacado ? 1 : 0.45,
                      }}
                    />
                  )}
                </div>

                {/* Eixo horizontal: rótulo a cada 3 dias para não poluir */}
                <span className="absolute bottom-0 inset-x-0 text-center text-[9px] tabular-nums text-areia-400">
                  {i % 3 === 0 ? formatarDiaMes(dia.data) : ""}
                </span>

                {destacado && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 w-40 -translate-x-1/2 rounded-lg border border-areia-200 bg-white p-2.5 text-left shadow-card-hover">
                    <p className="text-xs font-semibold text-areia-900">
                      {formatarDiaMes(dia.data)}
                    </p>
                    <p className="mt-1 flex items-center justify-between gap-2 text-[11px] text-areia-600">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COR_RECEBIDO }}
                        />
                        Recebido
                      </span>
                      <span className="font-medium tabular-nums text-areia-800">
                        {formatarMoeda(dia.recebido)}
                      </span>
                    </p>
                    <p className="mt-0.5 flex items-center justify-between gap-2 text-[11px] text-areia-600">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COR_PREVISTO }}
                        />
                        Previsto
                      </span>
                      <span className="font-medium tabular-nums text-areia-800">
                        {formatarMoeda(dia.previsto)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mesma informação em tabela, para leitura sem depender das cores */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-xs font-medium text-areia-600 hover:text-areia-900">
          Ver dados em tabela
        </summary>
        <div className="mt-2 max-h-52 overflow-y-auto rolagem-suave">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-areia-200 text-left text-areia-500">
                <th className="py-1.5 font-medium">Data</th>
                <th className="py-1.5 text-right font-medium">Recebido</th>
                <th className="py-1.5 text-right font-medium">Previsto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia-100">
              {dados.map((dia) => (
                <tr key={dia.data}>
                  <td className="py-1.5 text-areia-700">{formatarDiaMes(dia.data)}</td>
                  <td className="py-1.5 text-right tabular-nums text-areia-700">
                    {formatarMoeda(dia.recebido)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums text-areia-700">
                    {formatarMoeda(dia.previsto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function Item({
  cor,
  rotulo,
  valor,
  hachurado = false,
}: {
  cor: string;
  rotulo: string;
  valor: number;
  hachurado?: boolean;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-sm"
        style={{
          backgroundColor: cor,
          backgroundImage: hachurado
            ? "repeating-linear-gradient(45deg, rgba(255,255,255,0.75) 0 2px, transparent 2px 5px)"
            : undefined,
        }}
      />
      <span className="text-xs text-areia-600">{rotulo}</span>
      <span className="text-xs font-semibold tabular-nums text-areia-900">
        {formatarMoeda(valor)}
      </span>
    </span>
  );
}
