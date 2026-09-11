import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { IconeCheck, IconeFinanceiro } from "@/components/ui/Icons";
import { formatarData } from "@/lib/date";
import { ESTILO_FORMA_PAGAMENTO, formatarMoeda } from "@/lib/theme";
import type { Pagamento } from "@/lib/types";

export function HistoricoPagamentos({
  pagamentos,
}: {
  pagamentos: Pagamento[];
}) {
  return (
    <Card>
      <CardHeader
        titulo="Histórico de pagamentos"
        descricao="Lançamentos do aluno, com forma de pagamento e situação."
        icone={<IconeFinanceiro className="h-5 w-5" />}
      />

      <div className="overflow-x-auto rolagem-suave">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-areia-200 text-left text-xs uppercase tracking-wide text-areia-500">
              <th className="px-5 py-2.5 font-medium">Data</th>
              <th className="px-3 py-2.5 font-medium">Item</th>
              <th className="px-3 py-2.5 font-medium">Pagante</th>
              <th className="px-3 py-2.5 font-medium">Forma</th>
              <th className="px-3 py-2.5 text-right font-medium">Valor</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-areia-100">
            {pagamentos.slice(0, 12).map((pagamento) => {
              const forma = ESTILO_FORMA_PAGAMENTO[pagamento.formaPagamento];
              const confirmado = pagamento.status === "confirmado";

              return (
                <tr key={pagamento.id} className="hover:bg-areia-50">
                  <td className="whitespace-nowrap px-5 py-2.5 font-medium text-areia-800">
                    {formatarData(pagamento.data)}
                  </td>
                  <td className="px-3 py-2.5 text-areia-600">{pagamento.item}</td>
                  <td className="px-3 py-2.5 text-areia-600">
                    {pagamento.nomePagante}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge cor={forma.cor} fundo={forma.fundo} title={forma.detalhe}>
                      {forma.label}
                    </Badge>
                    {pagamento.valorTotalPass !== undefined && (
                      <span className="mt-1 block text-[11px] text-areia-500">
                        Total Pass {formatarMoeda(pagamento.valorTotalPass)} +
                        complemento{" "}
                        {formatarMoeda(pagamento.valor - pagamento.valorTotalPass)}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums text-areia-800">
                    {formatarMoeda(pagamento.valor)}
                  </td>
                  <td className="px-5 py-2.5">
                    {confirmado ? (
                      <Badge cor="#15803D" fundo="#F0FDF4">
                        <IconeCheck className="h-3.5 w-3.5" />
                        Confirmado
                      </Badge>
                    ) : (
                      <Badge cor="#8A2118" fundo="#FBE3E0" borda="#EC9A90">
                        Pendente
                        {pagamento.diasEmAtraso > 0 &&
                          ` · ${pagamento.diasEmAtraso}d`}
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
