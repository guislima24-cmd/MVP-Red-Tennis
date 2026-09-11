"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  IconeCongelado,
  IconeEmail,
  IconeTelefone,
  IconeVoltar,
} from "@/components/ui/Icons";
import { formatarData } from "@/lib/date";
import { ESTILO_CATEGORIA } from "@/lib/theme";
import type { Aluno } from "@/lib/types";

interface CabecalhoAlunoProps {
  aluno: Aluno;
  aoAlternarCongelamento: () => void;
}

export function CabecalhoAluno({
  aluno,
  aoAlternarCongelamento,
}: CabecalhoAlunoProps) {
  const categoria = ESTILO_CATEGORIA[aluno.categoriaRanking];

  return (
    <div className="space-y-4">
      <Link
        href="/agenda"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-areia-600 transition-colors hover:text-tijolo-700"
      >
        <IconeVoltar className="h-4 w-4" />
        Voltar para a agenda
      </Link>

      <section className="card overflow-hidden">
        {/* Faixa de saibro no topo do cartao */}
        <div className="h-20 bg-gradient-to-r from-saibro-600 via-saibro-500 to-saibro-700" />

        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
          <Avatar
            id={aluno.id}
            nome={aluno.nome}
            src={aluno.avatarUrl}
            tamanho="xl"
            comAnel
            className="-mt-12 shadow-card"
          />

          <div className="min-w-0 flex-1 sm:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-areia-900">{aluno.nome}</h1>
              {aluno.planoCongelado && (
                <Badge cor="#0369A1" fundo="#F0FAFF" borda="#A5DFF7">
                  <IconeCongelado className="h-3.5 w-3.5" />
                  Plano congelado
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-areia-600">
              <span className="flex items-center gap-1.5">
                <IconeTelefone className="h-4 w-4 text-areia-400" />
                {aluno.telefone}
              </span>
              <span className="flex items-center gap-1.5">
                <IconeEmail className="h-4 w-4 text-areia-400" />
                {aluno.email}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge cor="#9A4720" fundo="#FAE8DA" borda="#F3CEAF">
                Plano {aluno.plano}
              </Badge>
              <Badge
                cor={categoria.cor}
                fundo={categoria.fundo}
                borda={categoria.borda}
              >
                {categoria.label} · {categoria.descricao}
              </Badge>
              <Badge>Professor: {aluno.professorPrincipal}</Badge>
              <Badge>Aluno desde {formatarData(aluno.dataInicio)}</Badge>
            </div>
          </div>

          <div className="sm:pt-2">
            <button
              type="button"
              onClick={aoAlternarCongelamento}
              className={`w-full sm:w-auto ${
                aluno.planoCongelado ? "btn-primario" : "btn-secundario"
              }`}
            >
              <IconeCongelado className="h-4 w-4" />
              {aluno.planoCongelado ? "Reativar plano" : "Congelar plano"}
            </button>
          </div>
        </div>

        {aluno.planoCongelado && aluno.motivoCongelamento && (
          <p className="border-t border-areia-200 bg-sky-50/60 px-5 py-2.5 text-sm text-sky-800">
            <strong className="font-semibold">Motivo do congelamento:</strong>{" "}
            {aluno.motivoCongelamento}
          </p>
        )}
      </section>
    </div>
  );
}
