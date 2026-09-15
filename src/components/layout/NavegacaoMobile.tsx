"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ABAS } from "./abas";

/**
 * Barra de navegação fixa no rodapé, exibida apenas no celular.
 *
 * Substitui as abas da topbar em telas estreitas, onde elas exigiriam rolagem
 * horizontal. Os alvos de toque têm 56px de altura e ícone grande com rótulo,
 * para leitura e acerto fáceis — a arena é operada também por quem não tem
 * intimidade com celular.
 */
export function NavegacaoMobile() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-areia-200 bg-white/98 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {ABAS.map(({ href, curto, Icone }) => {
          const ativo = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`flex h-[56px] flex-col items-center justify-center gap-0.5 transition-colors ${
                  ativo ? "text-tijolo-700" : "text-areia-500"
                }`}
              >
                <Icone className={ativo ? "h-6 w-6" : "h-[22px] w-[22px]"} />
                <span
                  className={`text-[11px] leading-none ${
                    ativo ? "font-semibold" : "font-medium"
                  }`}
                >
                  {curto}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
