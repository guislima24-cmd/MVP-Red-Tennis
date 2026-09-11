"use client";

import { useEffect, type ReactNode } from "react";
import { IconeFechar } from "./Icons";

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: string;
  children: ReactNode;
  /** Largura máxima do painel. */
  largura?: "sm" | "md" | "lg";
}

const LARGURAS = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
} as const;

/** Janela modal simples, com fechamento por Esc e clique fora. */
export function Modal({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  largura = "md",
}: ModalProps) {
  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") aoFechar();
    }

    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-areia-900/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={aoFechar}
    >
      <div
        className={`w-full ${LARGURAS[largura]} animate-fade-up rounded-2xl border border-areia-200 bg-white shadow-card-hover`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-areia-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-areia-900">{titulo}</h2>
            {descricao && (
              <p className="mt-0.5 text-sm text-areia-600">{descricao}</p>
            )}
          </div>
          <button
            type="button"
            onClick={aoFechar}
            className="btn-fantasma shrink-0 px-2 py-1.5"
            aria-label="Fechar"
          >
            <IconeFechar className="h-4 w-4" />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}
