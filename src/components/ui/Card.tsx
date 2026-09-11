import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <section className={`card ${className}`}>{children}</section>;
}

interface CardHeaderProps {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  icone?: ReactNode;
  className?: string;
}

export function CardHeader({
  titulo,
  descricao,
  acao,
  icone,
  className = "",
}: CardHeaderProps) {
  return (
    <header
      className={`flex flex-wrap items-start justify-between gap-3 border-b border-areia-200 px-5 py-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        {icone && (
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-saibro-50 text-saibro-700">
            {icone}
          </span>
        )}
        <div>
          <h2 className="text-base font-semibold text-areia-900">{titulo}</h2>
          {descricao && (
            <p className="mt-0.5 text-sm text-areia-600">{descricao}</p>
          )}
        </div>
      </div>
      {acao}
    </header>
  );
}
