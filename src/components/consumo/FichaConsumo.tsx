"use client";

import { useState } from "react";
import { ModalConsumo } from "./ModalConsumo";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { IconeCopo, IconeMais } from "@/components/ui/Icons";
import { consumosDaPessoa, resumoConsumo } from "@/lib/selectors";
import { formatarMoeda } from "@/lib/theme";
import type { TipoPessoa } from "@/lib/types";
import { useApp } from "@/store/AppStore";

interface FichaConsumoProps {
  pessoaId: string;
  tipoPessoa: TipoPessoa;
  nomePessoa: string;
}

/**
 * Consumo no balcao (bebidas, cervejas e lanches) lancado na conta da pessoa.
 * Serve tanto para aluno quanto para professor — e o mesmo bloco nas duas fichas.
 */
export function FichaConsumo({
  pessoaId,
  tipoPessoa,
  nomePessoa,
}: FichaConsumoProps) {
  const { consumos, registrarConsumo } = useApp();
  const [aberto, setAberto] = useState(false);

  const lista = consumosDaPessoa(pessoaId, consumos);
  const resumo = resumoConsumo(pessoaId, consumos);

  return (
    <Card>
      <CardHeader
        titulo="Consumo no balcão"
        descricao="Bebidas e lanches lançados na conta."
        icone={<IconeCopo className="h-5 w-5" />}
        acao={
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="btn-primario py-2 text-xs"
          >
            <IconeMais className="h-3.5 w-3.5" />
            Lançar consumo
          </button>
        }
      />

      {/* Totais */}
      <div className="grid grid-cols-2 gap-px border-b border-areia-200 bg-areia-200">
        <div className="bg-white px-5 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-areia-500">
            Em aberto
          </p>
          <p
            className={`mt-1 text-xl font-bold ${
              resumo.totalEmAberto > 0 ? "text-tijolo-700" : "text-areia-900"
            }`}
          >
            {formatarMoeda(resumo.totalEmAberto)}
          </p>
        </div>
        <div className="bg-white px-5 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-areia-500">
            Já pago
          </p>
          <p className="mt-1 text-xl font-bold text-areia-900">
            {formatarMoeda(resumo.totalPago)}
          </p>
        </div>
      </div>

      <ul className="max-h-80 divide-y divide-areia-100 overflow-y-auto rolagem-suave">
        {lista.slice(0, 20).map((consumo) => (
          <li
            key={consumo.id}
            className="flex items-center gap-3 px-5 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-areia-900">
                {consumo.quantidade > 1 && (
                  <span className="text-areia-500">{consumo.quantidade}× </span>
                )}
                {consumo.produtoNome}
              </p>
              <p className="text-xs text-areia-500">
                {consumo.data.slice(8, 10)}/{consumo.data.slice(5, 7)} às{" "}
                {consumo.data.slice(11, 16)}
              </p>
            </div>

            {consumo.status === "em aberto" ? (
              <Badge cor="#A16207" fundo="#FEFBEB" borda="#F5D97A" className="text-[10px]">
                Em aberto
              </Badge>
            ) : (
              <Badge cor="#15803D" fundo="#F0FDF4" className="text-[10px]">
                Pago
              </Badge>
            )}

            <span className="w-20 shrink-0 text-right text-sm font-semibold tabular-nums text-areia-800">
              {formatarMoeda(consumo.valorUnitario * consumo.quantidade)}
            </span>
          </li>
        ))}

        {lista.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-areia-500">
            Nenhum consumo lançado ainda.
          </li>
        )}
      </ul>

      <ModalConsumo
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        nomePessoa={nomePessoa}
        aoConfirmar={(produtoId, quantidade) =>
          registrarConsumo(pessoaId, tipoPessoa, produtoId, quantidade)
        }
      />
    </Card>
  );
}
