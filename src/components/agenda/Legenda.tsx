import { Ponto } from "@/components/ui/Badge";
import { ESTILO_TIPO, ORDEM_TIPOS } from "@/lib/theme";

/**
 * Legenda de cores por tipo de alocacao.
 * As cores seguem exatamente o padrao acordado com a Red Tennis.
 */
export function Legenda({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}
      aria-label="Legenda de tipos de alocação"
    >
      {ORDEM_TIPOS.map((tipo) => (
        <span
          key={tipo}
          className="flex items-center gap-1.5 text-xs text-areia-700"
        >
          <Ponto cor={ESTILO_TIPO[tipo].cor} />
          {tipo}
        </span>
      ))}
    </div>
  );
}
