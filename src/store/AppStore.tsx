"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ALUNOS, USUARIOS } from "@/lib/mock-data";
import type { Aluno, Comentario } from "@/lib/types";

/**
 * Estado da aplicacao — vive apenas em memoria (React state).
 *
 * O MVP nao tem backend nem persistencia: o que o usuario altera durante a
 * demonstracao (novo comentario na ficha, congelar/descongelar um plano,
 * usuario logado) vale enquanto a aba estiver aberta e volta ao estado inicial
 * a cada reload. Quando houver API, este provider e o ponto natural para
 * substituir os `useState` por chamadas reais.
 */
interface AppStore {
  usuario: (typeof USUARIOS)[number];
  entrar: (usuarioId: string) => void;
  sair: () => void;

  /** Aluno com as alteracoes feitas na sessao ja aplicadas. */
  obterAluno: (id: string) => Aluno | undefined;
  alunos: Aluno[];

  adicionarComentario: (alunoId: string, texto: string) => void;
  alternarCongelamento: (alunoId: string) => void;
}

const Contexto = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuarioId, setUsuarioId] = useState(USUARIOS[0].id);
  const [comentariosExtras, setComentariosExtras] = useState<
    Record<string, Comentario[]>
  >({});
  const [congelamentos, setCongelamentos] = useState<Record<string, boolean>>(
    {},
  );

  const usuario = useMemo(
    () => USUARIOS.find((u) => u.id === usuarioId) ?? USUARIOS[0],
    [usuarioId],
  );

  const entrar = useCallback((id: string) => setUsuarioId(id), []);
  const sair = useCallback(() => setUsuarioId(USUARIOS[0].id), []);

  const alunos = useMemo(
    () =>
      ALUNOS.map((aluno) => {
        const extras = comentariosExtras[aluno.id];
        const congelado = congelamentos[aluno.id];

        if (!extras && congelado === undefined) return aluno;

        return {
          ...aluno,
          planoCongelado: congelado ?? aluno.planoCongelado,
          motivoCongelamento:
            congelado === true && !aluno.motivoCongelamento
              ? "Congelado durante a sessão pelo gestor"
              : congelado === false
                ? undefined
                : aluno.motivoCongelamento,
          comentarios: extras ? [...extras, ...aluno.comentarios] : aluno.comentarios,
        };
      }),
    [comentariosExtras, congelamentos],
  );

  const obterAluno = useCallback(
    (id: string) => alunos.find((a) => a.id === id),
    [alunos],
  );

  const adicionarComentario = useCallback(
    (alunoId: string, texto: string) => {
      const limpo = texto.trim();
      if (!limpo) return;

      const agora = new Date();
      const novo: Comentario = {
        id: `c-novo-${alunoId}-${agora.getTime()}`,
        data: `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(
          agora.getDate(),
        ).padStart(2, "0")}T${String(agora.getHours()).padStart(2, "0")}:${String(
          agora.getMinutes(),
        ).padStart(2, "0")}`,
        autor: usuario.nome,
        texto: limpo,
      };

      setComentariosExtras((atual) => ({
        ...atual,
        [alunoId]: [novo, ...(atual[alunoId] ?? [])],
      }));
    },
    [usuario.nome],
  );

  const alternarCongelamento = useCallback((alunoId: string) => {
    setCongelamentos((atual) => {
      const base = ALUNOS.find((a) => a.id === alunoId)?.planoCongelado ?? false;
      const atualValor = atual[alunoId] ?? base;
      return { ...atual, [alunoId]: !atualValor };
    });
  }, []);

  const valor = useMemo<AppStore>(
    () => ({
      usuario,
      entrar,
      sair,
      alunos,
      obterAluno,
      adicionarComentario,
      alternarCongelamento,
    }),
    [
      usuario,
      entrar,
      sair,
      alunos,
      obterAluno,
      adicionarComentario,
      alternarCongelamento,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useApp(): AppStore {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useApp precisa estar dentro de <AppProvider>.");
  }
  return contexto;
}
