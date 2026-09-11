"use client";

import { useState, type FormEvent } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { IconeMais, IconeNota } from "@/components/ui/Icons";
import type { Comentario } from "@/lib/types";

interface ComentariosProps {
  comentarios: Comentario[];
  aoAdicionar: (texto: string) => void;
}

/**
 * Bloco de notas do gestor sobre o aluno.
 * Cada comentario registra data e autor. Novos comentarios ficam em memoria
 * durante a sessao (sem backend).
 */
export function Comentarios({ comentarios, aoAdicionar }: ComentariosProps) {
  const [texto, setTexto] = useState("");

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (!texto.trim()) return;
    aoAdicionar(texto);
    setTexto("");
  }

  return (
    <Card>
      <CardHeader
        titulo="Observações do gestor"
        descricao="Histórico de notas internas sobre o aluno."
        icone={<IconeNota className="h-5 w-5" />}
      />

      <form onSubmit={enviar} className="border-b border-areia-200 p-4">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Escreva uma observação sobre este aluno…"
          className="campo resize-none"
        />
        <button
          type="submit"
          disabled={!texto.trim()}
          className="btn-primario mt-2.5 w-full"
        >
          <IconeMais className="h-4 w-4" />
          Adicionar observação
        </button>
      </form>

      <ul className="divide-y divide-areia-100">
        {comentarios.map((comentario) => (
          <li key={comentario.id} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-areia-800">
                {comentario.autor}
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-areia-500">
                {formatarDataHora(comentario.data)}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-areia-700">
              {comentario.texto}
            </p>
          </li>
        ))}

        {comentarios.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-areia-500">
            Nenhuma observação registrada ainda.
          </li>
        )}
      </ul>
    </Card>
  );
}

/** "2026-09-10T14:32" -> "10/09/2026 · 14:32" */
function formatarDataHora(iso: string): string {
  const [data, hora] = iso.split("T");
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}${hora ? ` · ${hora}` : ""}`;
}
