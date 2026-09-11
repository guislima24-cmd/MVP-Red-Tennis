import type { ReactNode } from "react";

interface StatCardProps {
  rotulo: string;
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
  valor,
  detalhe,
  icone,
  tom = "neutro",
}: StatCardProps) {
  const estilo = TONS[tom];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 shadow-card ${estilo.caixa}`}
    >
      {icone && (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${estilo.icone}`}
        >
          {icone}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-areia-500">
          {rotulo}
        </p>
        <p className={`mt-1 text-2xl font-semibold leading-none ${estilo.valor}`}>
          {valor}
        </p>
        {detalhe && (
          <p className="mt-1.5 text-xs leading-snug text-areia-600">{detalhe}</p>
        )}
      </div>
    </div>
  );
}
