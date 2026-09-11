"use client";

import Link from "next/link";
import { Quadra3D } from "./Quadra3D";
import { IconeAlerta, IconeRelogio } from "@/components/ui/Icons";
import { rotuloQuadra } from "@/lib/theme";
import type { OcupacaoQuadra } from "@/lib/selectors";

/**
 * Cartao de uma quadra no Dashboard.
 * Clicar leva direto para a Agenda ja filtrada por aquela quadra.
 */
export function CardQuadra({ ocupacao }: { ocupacao: OcupacaoQuadra }) {
  const { quadra, taxa, ocupados, total, proximaFaixaLivre, conflitos } = ocupacao;
  const percentual = Math.round(taxa * 100);
  const paredao = quadra === "paredao";

  return (
    <Link
      href={`/agenda?quadra=${quadra}`}
      className="group flex flex-col rounded-2xl border border-areia-200 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-saibro-300 hover:shadow-card-hover focus-visible:-translate-y-1"
      aria-label={`${rotuloQuadra(quadra)} — ${percentual}% de ocupação hoje. Abrir na agenda.`}
    >
      <div className="px-1 pb-3 pt-1 transition-transform duration-300 group-hover:scale-[1.03]">
        <Quadra3D
          rotulo={paredao ? "P" : String(quadra)}
          taxa={taxa}
          paredao={paredao}
        />
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-areia-900">
            {rotuloQuadra(quadra)}
          </h3>
          <span className="text-sm font-bold text-saibro-700">{percentual}%</span>
        </div>

        {/* Barra de ocupacao do dia */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-areia-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-saibro-400 to-saibro-700 transition-[width] duration-500"
            style={{ width: `${Math.max(percentual, 3)}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-areia-600">
          {ocupados} de {total} horários preenchidos
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {conflitos > 0 ? (
            <span className="chip border border-tijolo-200 bg-tijolo-50 text-[11px] text-tijolo-700">
              <IconeAlerta className="h-3.5 w-3.5" />
              {conflitos} conflito{conflitos > 1 ? "s" : ""}
            </span>
          ) : proximaFaixaLivre ? (
            <span className="chip bg-areia-100 text-[11px] text-areia-600">
              <IconeRelogio className="h-3.5 w-3.5" />
              Livre às {proximaFaixaLivre}
            </span>
          ) : (
            <span className="chip border border-saibro-200 bg-saibro-50 text-[11px] text-saibro-800">
              Agenda lotada hoje
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
