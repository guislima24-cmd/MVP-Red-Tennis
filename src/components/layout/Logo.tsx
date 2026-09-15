import {
  LOGO_COMPLETO,
  LOGO_MARCA,
  PROPORCAO_LOGO,
} from "@/lib/branding";

interface LogoProps {
  /** "completo" inclui o letreiro RED TENNIS; "marca" mostra apenas a quadra. */
  variante?: "completo" | "marca";
  className?: string;
}

/**
 * Marca da Red Tennis.
 *
 * Usa o logo oficial da arena, com fundo transparente. A altura vem da
 * classe passada pelo chamador (`h-8`, `h-28`…) e a largura acompanha a
 * proporção do arquivo.
 */
export function Logo({ variante = "completo", className }: LogoProps) {
  const marca = variante === "marca";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={marca ? LOGO_MARCA : LOGO_COMPLETO}
      alt="Red Tennis"
      width={447}
      height={marca ? 150 : 311}
      className={className}
      style={{ aspectRatio: marca ? PROPORCAO_LOGO.marca : PROPORCAO_LOGO.completo }}
    />
  );
}
