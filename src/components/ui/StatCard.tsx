import type { ReactNode } from "react";

interface StatCardProps {
  rotulo: string;
  /** Versão enxuta do rótulo, usada no celular para não quebrar em duas linhas. */
  rotuloCurto?: string;
  valor: string;
  detalhe?: string;
  icone?: ReactNode;
  /** Destaque visual quando o numero exige atencao (ex.: pendencias). */
  tom?: "neutro" | "saibro" | "alerta" | "positivo";
}

const TONS = {
  neutro: {
    caixa: "border-areia-200 bg-white",
    icone: "bg-areia-100 text-areia-600",
    valor: "text-areia-900",
  },
  saibro: {
    caixa: "border-saibro-200 bg-saibro-50/60",
    icone: "bg-saibro-100 text-saibro-700",
    valor: "text-saibro-800",
  },
  alerta: {
    caixa: "border-tijolo-200 bg-tijolo-50/70",
    icone: "bg-tijolo-100 text-tijolo-700",
    valor: "text-tijolo-700",
  },
  positivo: {
    caixa: "border-emerald-200 bg-emerald-50/60",
    icone: "bg-emerald-100 text-emerald-700",
    valor: "text-emerald-700",
  },
} as const;

export function StatCard({
  rotulo,
  rotuloCurto,
  valor,
  detalhe,
  icone,
  tom = "neutro",
}: StatCardProps) {
  const estilo = TONS[tom];

  return (
    <div
      className={`flex items-start gap-2.5 rounded-2xl border p-3 shadow-card sm:gap-3 sm:p-4 ${estilo.caixa}`}
    >
      {icone && (
        <span
          className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex ${estilo.icone}`}
        >
          {icone}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-areia-500">
          {rotuloCurto ? (
            <>
              <span className="sm:hidden">{rotuloCurto}</span>
              <span className="hidden sm:inline">{rotulo}</span>
            </>
          ) : (
            rotulo
          )}
        </p>
        {/* sm:leading-none é necessário: a variante sm:text-2xl traz o
            line-height dela e sobrescreveria o leading-none base. */}
        <p
          className={`mt-1 text-xl font-semibold leading-none sm:text-2xl sm:leading-none ${estilo.valor}`}
        >
          {valor}
        </p>
        {detalhe && (
          <p className="mt-1.5 hidden text-xs leading-snug text-areia-600 sm:block">
            {detalhe}
          </p>
        )}
      </div>
    </div>
  );
}
