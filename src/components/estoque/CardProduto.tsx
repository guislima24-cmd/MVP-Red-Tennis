"use client";

import { Badge } from "@/components/ui/Badge";
import { IconeEntrada, IconeLixeira } from "@/components/ui/Icons";
import { nivelDoEstoque } from "@/lib/selectors";
import {
  ESTILO_CATEGORIA_PRODUTO,
  ESTILO_NIVEL_ESTOQUE,
  formatarMoeda,
} from "@/lib/theme";
import type { Produto } from "@/lib/types";

interface CardProdutoProps {
  produto: Produto;
  aoRegistrarEntrada: (produto: Produto) => void;
  aoRegistrarBaixa: (produto: Produto) => void;
}

/**
 * Cartao de um item do estoque.
 *
 * A leitura rapida vem da combinacao de tres sinais — barra de nivel, numero
 * grande e rotulo de situacao — para nao depender so da cor.
 */
export function CardProduto({
  produto,
  aoRegistrarEntrada,
  aoRegistrarBaixa,
}: CardProdutoProps) {
  const nivel = nivelDoEstoque(produto);
  const estilo = ESTILO_NIVEL_ESTOQUE[nivel];
  const categoria = ESTILO_CATEGORIA_PRODUTO[produto.categoria];

  // A barra usa o dobro do mínimo como referência de "estoque cheio".
  const referencia = Math.max(produto.estoqueMinimo * 2, 1);
  const preenchimento = Math.min(100, (produto.quantidade / referencia) * 100);

  return (
    <article className="flex flex-col rounded-2xl border border-areia-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-areia-900">
            {produto.nome}
          </h3>
          <p className="mt-0.5 text-xs text-areia-500">{produto.unidade}</p>
        </div>
        <Badge
          cor={categoria.cor}
          fundo={categoria.fundo}
          borda={categoria.borda}
          className="shrink-0 text-[10px]"
        >
          {produto.categoria}
        </Badge>
      </header>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <span
            className="text-3xl font-bold leading-none"
            style={{ color: estilo.cor }}
          >
            {produto.quantidade}
          </span>
          <span className="ml-1.5 text-xs text-areia-500">
            / mín. {produto.estoqueMinimo}
          </span>
        </div>
        <Badge
          cor={estilo.cor}
          fundo={estilo.fundo}
          borda={estilo.borda}
          className="text-[11px]"
        >
          {estilo.label}
        </Badge>
      </div>

      <div className="relative mt-2.5 h-2 w-full overflow-hidden rounded-full bg-areia-100">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${Math.max(preenchimento, produto.quantidade > 0 ? 4 : 0)}%`,
            backgroundColor: estilo.barra,
          }}
        />
        {/* Marca do estoque mínimo */}
        <span
          className="absolute top-0 h-full w-px bg-areia-400"
          style={{ left: `${(produto.estoqueMinimo / referencia) * 100}%` }}
          title={`Estoque mínimo: ${produto.estoqueMinimo}`}
        />
      </div>

      <p className="mt-2.5 text-xs text-areia-600">
        Venda <strong className="font-semibold">{formatarMoeda(produto.precoVenda)}</strong>
        <span className="text-areia-400"> · custo {formatarMoeda(produto.precoCusto)}</span>
      </p>

      <div className="mt-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => aoRegistrarEntrada(produto)}
          className="btn-secundario flex-1 px-2 py-1.5 text-xs"
        >
          <IconeEntrada className="h-3.5 w-3.5" />
          Entrada
        </button>
        <button
          type="button"
          onClick={() => aoRegistrarBaixa(produto)}
          disabled={produto.quantidade === 0}
          className="btn-secundario px-2.5 py-1.5 text-xs"
          title="Registrar perda ou quebra"
        >
          <IconeLixeira className="h-3.5 w-3.5" />
          Baixa
        </button>
      </div>
    </article>
  );
}
