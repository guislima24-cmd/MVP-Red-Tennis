"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  IconeDesceu,
  IconeEstavel,
  IconeSubiu,
} from "@/components/ui/Icons";
import { ESTILO_CATEGORIA } from "@/lib/theme";
import type { Aluno } from "@/lib/types";

interface ListaRankingProps {
  jogadores: Aluno[];
  /** Ids que disputam a etapa atual — recebem um selo na lista. */
  inscritos: string[];
}

export function ListaRanking({ jogadores, inscritos }: ListaRankingProps) {
  return (
    <ol className="divide-y divide-areia-100">
      {jogadores.map((aluno, indice) => {
        const posicao = indice + 1;
        const categoria = ESTILO_CATEGORIA[aluno.categoriaRanking];
        const naEtapa = inscritos.includes(aluno.id);

        return (
          <li key={aluno.id}>
            <Link
              href={`/alunos/${aluno.id}`}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-areia-50 sm:px-5"
            >
              <span
                className={`w-7 shrink-0 text-right text-sm font-bold tabular-nums ${
                  posicao <= 3 ? "text-saibro-700" : "text-areia-400"
                }`}
              >
                {posicao}
              </span>

              <Avatar
                id={aluno.id}
                nome={aluno.nome}
                src={aluno.avatarUrl}
                tamanho="sm"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-areia-900">
                  {aluno.nome}
                </p>
                <p className="truncate text-xs text-areia-500">
                  {aluno.plano} · {aluno.professorPrincipal}
                </p>
              </div>

              {naEtapa && (
                <span className="hidden shrink-0 rounded-full bg-saibro-50 px-2 py-0.5 text-[10px] font-semibold text-saibro-700 sm:block">
                  Na etapa
                </span>
              )}

              <Badge
                cor={categoria.cor}
                fundo={categoria.fundo}
                borda={categoria.borda}
                className="hidden shrink-0 text-[11px] sm:inline-flex"
              >
                {aluno.categoriaRanking}
              </Badge>

              <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-areia-800">
                {aluno.rankingPontuacao}
              </span>

              <span
                className={`flex w-12 shrink-0 items-center justify-end gap-0.5 text-xs font-medium tabular-nums ${
                  aluno.variacaoRanking > 0
                    ? "text-emerald-600"
                    : aluno.variacaoRanking < 0
                      ? "text-tijolo-600"
                      : "text-areia-400"
                }`}
                title="Variação desde a última apuração"
              >
                {aluno.variacaoRanking > 0 ? (
                  <>
                    <IconeSubiu className="h-3.5 w-3.5" />
                    {aluno.variacaoRanking}
                  </>
                ) : aluno.variacaoRanking < 0 ? (
                  <>
                    <IconeDesceu className="h-3.5 w-3.5" />
                    {Math.abs(aluno.variacaoRanking)}
                  </>
                ) : (
                  <IconeEstavel className="h-3.5 w-3.5" />
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
