"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { formatarMoeda } from "@/lib/theme";
import type { Produto } from "@/lib/types";

interface ModalMovimentoProps {
  produto: Produto | null;
  tipo: "entrada" | "perda";
  aoFechar: () => void;
  aoConfirmar: (quantidade: number, observacao: string) => void;
}

const MOTIVOS_PERDA = [
  "Quebra / derrubado",
  "Vencimento",
  "Cortesia",
  "Erro de contagem",
];

/** Registro de entrada (reposição) ou baixa (perda) de um item. */
export function ModalMovimento({
  produto,
  tipo,
  aoFechar,
  aoConfirmar,
}: ModalMovimentoProps) {
  const [quantidade, setQuantidade] = useState(tipo === "entrada" ? 24 : 1);
  const [observacao, setObservacao] = useState("");

  if (!produto) return null;

  const entrada = tipo === "entrada";
  const maximo = entrada ? 999 : produto.quantidade;
  const saldoFinal = entrada
    ? produto.quantidade + quantidade
    : Math.max(0, produto.quantidade - quantidade);

  function confirmar(evento: FormEvent) {
    evento.preventDefault();
    if (quantidade <= 0) return;
    aoConfirmar(quantidade, observacao);
    aoFechar();
  }

  return (
    <Modal
      aberto
      aoFechar={aoFechar}
      titulo={entrada ? "Registrar entrada" : "Registrar baixa"}
      descricao={`${produto.nome} · ${produto.unidade}`}
      largura="sm"
    >
      <form onSubmit={confirmar}>
        <div className="space-y-4 p-5">
          <div>
            <label
              htmlFor="quantidade"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-500"
            >
              Quantidade
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="btn-secundario h-10 w-10 p-0 text-lg"
              >
                −
              </button>
              <input
                id="quantidade"
                type="number"
                min={1}
                max={maximo}
                value={quantidade}
                onChange={(e) =>
                  setQuantidade(
                    Math.min(maximo, Math.max(1, Number(e.target.value) || 1)),
                  )
                }
                className="campo text-center text-lg font-semibold"
              />
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.min(maximo, q + 1))}
                className="btn-secundario h-10 w-10 p-0 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {entrada ? (
            <div>
              <label
                htmlFor="obs"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-500"
              >
                Observação
              </label>
              <input
                id="obs"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Nota fiscal, fornecedor…"
                className="campo"
              />
            </div>
          ) : (
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-500">
                Motivo
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MOTIVOS_PERDA.map((motivo) => (
                  <button
                    key={motivo}
                    type="button"
                    onClick={() => setObservacao(motivo)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      observacao === motivo
                        ? "bg-tijolo-600 text-white"
                        : "bg-areia-100 text-areia-700 hover:bg-areia-200"
                    }`}
                  >
                    {motivo}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl bg-areia-50 px-3.5 py-3 text-sm">
            <p className="flex items-center justify-between text-areia-600">
              Saldo atual
              <span className="font-semibold text-areia-800">
                {produto.quantidade}
              </span>
            </p>
            <p className="mt-1 flex items-center justify-between text-areia-600">
              Saldo após o lançamento
              <span
                className={`font-semibold ${
                  saldoFinal < produto.estoqueMinimo
                    ? "text-tijolo-700"
                    : "text-emerald-700"
                }`}
              >
                {saldoFinal}
              </span>
            </p>
            {entrada && (
              <p className="mt-1 flex items-center justify-between text-areia-500">
                Custo estimado da compra
                <span className="font-medium">
                  {formatarMoeda(produto.precoCusto * quantidade)}
                </span>
              </p>
            )}
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-areia-200 px-5 py-4">
          <button type="button" onClick={aoFechar} className="btn-secundario py-2">
            Cancelar
          </button>
          <button type="submit" className="btn-primario py-2">
            {entrada ? "Confirmar entrada" : "Confirmar baixa"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
