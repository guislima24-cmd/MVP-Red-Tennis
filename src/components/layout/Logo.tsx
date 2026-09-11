import { LOGO_OFICIAL } from "@/lib/branding";

interface LogoProps {
  /** "completo" inclui o letreiro RED TENNIS; "marca" mostra apenas a quadra. */
  variante?: "completo" | "marca";
  className?: string;
  /** Usa tons claros — para fundos escuros (ex.: painel do login). */
  invertido?: boolean;
}

/**
 * Marca da Red Tennis: quadra de saibro em curva sobre o letreiro.
 * Reconstruida em vetor a partir do logo original da arena.
 */
export function Logo({
  variante = "completo",
  className,
  invertido = false,
}: LogoProps) {
  if (LOGO_OFICIAL) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={LOGO_OFICIAL} alt="Red Tennis" className={className} />;
  }

  const corTexto = invertido ? "#FFFFFF" : "#8A2118";
  const corTextoSecundario = invertido ? "#F3CEAF" : "#A32A1C";
  const apenasMarca = variante === "marca";

  return (
    <svg
      viewBox={apenasMarca ? "6 20 188 78" : "0 0 200 150"}
      className={className}
      role="img"
      aria-label="Red Tennis"
    >
      <defs>
        <linearGradient id="rt-saibro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E68A4B" />
          <stop offset="45%" stopColor="#C9642F" />
          <stop offset="100%" stopColor="#9A4720" />
        </linearGradient>
        <linearGradient id="rt-brilho" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="rt-domo">
          <path d="M10 74 Q100 -22 190 74 Q100 110 10 74 Z" />
        </clipPath>
      </defs>

      {/* Domo de saibro */}
      <g>
        <path
          d="M10 74 Q100 -22 190 74 Q100 110 10 74 Z"
          fill="url(#rt-saibro)"
        />

        {/* Marcacoes da quadra, acompanhando a curvatura */}
        <g
          clipPath="url(#rt-domo)"
          fill="none"
          stroke="#FFF6EE"
          strokeWidth="2.3"
          strokeLinecap="round"
          opacity="0.95"
        >
          {/* Linha de fundo, linha de saque e rede, acompanhando a curvatura */}
          <path d="M22 72 Q100 -10 178 72" />
          <path d="M38 79 Q100 10 162 79" />
          <path d="M56 85 Q100 34 144 85" />
          {/* Linha central e laterais */}
          <path d="M100 28 L100 96" strokeWidth="1.8" />
          <path d="M22 72 Q17 84 19 100" />
          <path d="M178 72 Q183 84 181 100" />
        </g>

        {/* Brilho suave sobre o saibro */}
        <path
          d="M10 74 Q100 -22 190 74 Q100 110 10 74 Z"
          fill="url(#rt-brilho)"
        />
      </g>

      {!apenasMarca && (
        <g
          fontFamily="Georgia, 'Times New Roman', serif"
          textAnchor="middle"
          fill={corTexto}
        >
          <text x="100" y="122" fontSize="52" fontWeight="700" letterSpacing="1">
            RED
          </text>
          <text
            x="100"
            y="143"
            fontSize="19"
            fontWeight="600"
            letterSpacing="7"
            fill={corTextoSecundario}
          >
            TENNIS
          </text>
        </g>
      )}
    </svg>
  );
}
