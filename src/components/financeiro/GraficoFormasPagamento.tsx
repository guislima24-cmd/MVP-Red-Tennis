"use client";

import { ESTILO_FORMA_PAGAMENTO, formatarMoeda } from "@/lib/theme";
import type { TotalPorForma } from "@/lib/selectors";

/**
 * Participacao de cada forma de pagamento no mes.
 *
 * Barras horizontais ordenadas por valor, com rotulo direto em cada linha —
 * a leitura nao depende da cor, que serve apenas para reconhecer a forma de
 * pagamento entre a tabela e o grafico.
 */
export function GraficoFormasPagamento({ dados }: { dados: TotalPorForma[] }) {
  const maximo = Math.max(...dados.map((d) => d.total), 1);

  return (
    <ul className="space-y-3.5">
      {dados.map((item) => {
        const estilo = ESTILO_FORMA_PAGAMENTO[item.forma];
        return (
          <li key={item.forma}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-areia-800">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: estilo.corGrafico }}
                />
                {estilo.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-areia-900">
                {formatarMoeda(item.total)}
                <span className="ml-2 text-xs font-normal text-areia-500">
                  {Math.round(item.participacao * 100)}%
                </span>
              </span>
            </div>

            <div className="mt-1.5 h-2.5 w-full rounded-full bg-areia-100">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${Math.max((item.total / maximo) * 100, 2)}%`,
                  backgroundColor: estilo.corGrafico,
                }}
              />
            </div>

            <p className="mt-1 text-[11px] text-areia-500">
              {item.quantidade} lançamento{item.quantidade === 1 ? "" : "s"} ·{" "}
              {estilo.detalhe}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
