/**
 * Ponto unico de troca do logo.
 *
 * O MVP desenha a marca da Red Tennis em SVG vetorial (arquivo
 * `src/components/layout/Logo.tsx`), o que garante nitidez em qualquer
 * tamanho e zero dependencia de rede.
 *
 * Para usar o arquivo oficial no lugar do vetor:
 *   1. coloque a imagem em `public/` (ex.: `public/logo-red-tennis.webp`);
 *   2. troque o valor abaixo para o caminho do arquivo.
 * Nao e preciso alterar mais nada — todas as telas usam o mesmo componente.
 */
export const LOGO_OFICIAL: string | null = null;
