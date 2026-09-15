import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { IconeRelogio } from "@/components/ui/Icons";
import { formatarData } from "@/lib/date";
import { ESTILO_STATUS_AULA, MOTIVO_FALTA, rotuloQuadra } from "@/lib/theme";
import type { HistoricoAula, MotivoFalta } from "@/lib/types";

/** Siglas de falta usadas pela arena, exibidas como legenda da tabela. */
const SIGLAS: MotivoFalta[] = [
  "CH",
  "aviso_24h",
  "falta_professor",
  "IAC",
  "TIP",
];

export function HistoricoAulas({ aulas }: { aulas: HistoricoAula[] }) {
  return (
    <Card>
      <CardHeader
        titulo="Histórico de horários"
        descricao="Aulas anteriores, com motivo de falta ou reagendamento."
        icone={<IconeRelogio className="h-5 w-5" />}
      />

      {/* Celular: cada aula vira uma linha compacta, sem rolagem lateral */}
      <ul className="divide-y divide-areia-100 md:hidden">
        {aulas.map((aula, i) => {
          const status = ESTILO_STATUS_AULA[aula.status];
          const motivo = aula.motivoFalta ? MOTIVO_FALTA[aula.motivoFalta] : null;
          return (
            <li key={`m-${aula.data}-${i}`} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-areia-900">
                  {formatarData(aula.data)} · {aula.horario}
                </span>
                <Badge cor={status.cor} fundo={status.fundo}>
                  {status.label}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-areia-500">
                {rotuloQuadra(aula.quadra)} · {aula.professor}
              </p>
              {motivo && (
                <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge cor={motivo.cor} fundo={motivo.fundo} title={motivo.descricao}>
                    {motivo.sigla}
                  </Badge>
                  <span className="text-xs text-areia-600">{motivo.label}</span>
                  {aula.minutosRepostos && (
                    <span className="text-xs font-medium text-emerald-700">
                      +{aula.minutosRepostos}min
                    </span>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto rolagem-suave md:block">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-areia-200 text-left text-xs uppercase tracking-wide text-areia-500">
              <th className="px-5 py-2.5 font-medium">Data</th>
              <th className="px-3 py-2.5 font-medium">Horário</th>
              <th className="px-3 py-2.5 font-medium">Local</th>
              <th className="px-3 py-2.5 font-medium">Professor</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-areia-100">
            {aulas.map((aula, i) => {
              const status = ESTILO_STATUS_AULA[aula.status];
              const motivo = aula.motivoFalta
                ? MOTIVO_FALTA[aula.motivoFalta]
                : null;

              return (
                <tr key={`${aula.data}-${i}`} className="hover:bg-areia-50">
                  <td className="whitespace-nowrap px-5 py-2.5 font-medium text-areia-800">
                    {formatarData(aula.data)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-areia-600">
                    {aula.horario}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-areia-600">
                    {rotuloQuadra(aula.quadra)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-areia-600">
                    {aula.professor}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge cor={status.cor} fundo={status.fundo}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-5 py-2.5">
                    {motivo ? (
                      <span className="flex items-center gap-2">
                        <Badge
                          cor={motivo.cor}
                          fundo={motivo.fundo}
                          title={motivo.descricao}
                        >
                          {motivo.sigla}
                        </Badge>
                        <span className="text-xs text-areia-500">
                          {motivo.label}
                        </span>
                        {aula.minutosRepostos && (
                          <span className="text-xs font-medium text-emerald-700">
                            +{aula.minutosRepostos}min
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-areia-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-areia-200 px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-areia-500">
          Siglas
        </span>
        {SIGLAS.map((sigla) => {
          const motivo = MOTIVO_FALTA[sigla];
          return (
            <span
              key={sigla}
              className="text-xs text-areia-600"
              title={motivo.descricao}
            >
              <strong className="font-semibold" style={{ color: motivo.cor }}>
                {motivo.sigla}
              </strong>{" "}
              = {motivo.label}
            </span>
          );
        })}
      </footer>
    </Card>
  );
}
