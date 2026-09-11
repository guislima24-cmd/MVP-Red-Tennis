"use client";

import Link from "next/link";
import { IconeAlerta } from "@/components/ui/Icons";
import { ESTILO_TIPO, rotuloQuadraCurto } from "@/lib/theme";
import { nomeCompacto, nomeDoAluno } from "@/lib/selectors";
import type { Horario } from "@/lib/types";

interface EventoChipProps {
  horario: Horario;
  /** Versao reduzida, usada quando varias quadras dividem a mesma celula. */
  compacto?: boolean;
  /** Dia ja passou — o evento aparece esmaecido. */
  passado?: boolean;
}

/**
 * Evento da agenda.
 *
 * Com uma quadra selecionada, o chip lista todos os alunos da turma — sem
 * limite de pessoas. No panorama com as 5 areas ao mesmo tempo, ele reduz a
 * lista para caber na celula e indica quantos faltam; a turma inteira continua
 * visivel no tooltip e ao filtrar por aquela quadra.
 */
const NOMES_VISIVEIS_MODO_COMPACTO = 2;
export function EventoChip({
  horario,
  compacto = false,
  passado = false,
}: EventoChipProps) {
  const estilo = ESTILO_TIPO[horario.tipo];
  const semProfessor = horario.professor === "Sem professor";

  const nomes = horario.alunosIds.map((id) => ({ id, nome: nomeDoAluno(id) }));
  const visiveis = compacto
    ? nomes.slice(0, NOMES_VISIVEIS_MODO_COMPACTO)
    : nomes;
  const ocultos = nomes.length - visiveis.length;

  return (
    <article
      className={`relative rounded-lg border-l-[3px] px-2 py-1.5 text-left transition-shadow ${
        horario.temConflito
          ? "ring-2 ring-tijolo-500 animate-conflito-pulse"
          : "hover:shadow-sm"
      } ${passado ? "opacity-55" : ""}`}
      style={{
        backgroundColor: estilo.fundo,
        borderLeftColor: estilo.cor,
        boxShadow: horario.temConflito ? undefined : `inset 0 0 0 1px ${estilo.borda}`,
      }}
      title={`${horario.tipo} · ${horario.horaInicio}–${horario.horaFim} · ${horario.professor}\n${nomes
        .map((a) => a.nome)
        .join(", ")}`}
    >
      <header className="flex items-center gap-1">
        <span
          className="rounded px-1 text-[10px] font-bold leading-4"
          style={{ backgroundColor: estilo.cor, color: "#fff" }}
        >
          {rotuloQuadraCurto(horario.quadra)}
        </span>
        {!compacto && (
          <span
            className="truncate text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: estilo.texto }}
          >
            {horario.tipo}
          </span>
        )}
        {horario.temConflito && (
          <IconeAlerta
            className="ml-auto h-3.5 w-3.5 shrink-0 text-tijolo-600"
            aria-label="Conflito de horário"
          />
        )}
      </header>

      <ul className="mt-0.5 space-y-px">
        {visiveis.map(({ id, nome }) => (
          <li key={id} className="truncate leading-tight">
            <Link
              href={`/alunos/${id}`}
              className="text-[11px] font-medium text-areia-800 underline-offset-2 hover:underline"
            >
              {compacto ? nomeCompacto(nome) : nome}
            </Link>
          </li>
        ))}
        {ocultos > 0 && (
          <li className="text-[10px] font-medium leading-tight text-areia-500">
            +{ocultos} na turma
          </li>
        )}
      </ul>

      <p
        className={`mt-0.5 truncate text-[10px] ${
          semProfessor ? "italic text-areia-500" : "text-areia-600"
        }`}
      >
        {horario.professor}
      </p>
    </article>
  );
}
