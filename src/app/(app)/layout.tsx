import { Topbar } from "@/components/layout/Topbar";

/**
 * As telas internas dependem da data corrente da arena ("hoje" na agenda, no
 * dashboard e no financeiro). Renderizar sob demanda evita que um HTML gerado
 * no build congele a data e divirja do cliente.
 *
 * Observacao para quem for evoluir o projeto: esta configuracao so tem efeito
 * em Server Components — por isso ela vive aqui, no layout, e nao nas paginas,
 * que sao Client Components.
 */
export const dynamic = "force-dynamic";

/**
 * Casca das telas internas: topbar fixa com as 4 abas principais.
 * A tela de login (`/`) fica fora deste grupo e por isso nao tem navegacao.
 */
export default function LayoutApp({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fundo-arena min-h-screen">
      <Topbar />
      <main className="w-full px-4 py-6 sm:px-6 sm:py-8 2xl:px-10">
        {children}
      </main>
      <footer className="w-full px-4 pb-8 pt-2 text-center text-xs text-areia-500 sm:px-6">
        MVP desenvolvido pela UFABC Júnior · dados fictícios para demonstração
      </footer>
    </div>
  );
}
