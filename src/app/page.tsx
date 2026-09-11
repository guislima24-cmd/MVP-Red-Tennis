"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/layout/Logo";
import { IconeCadeado, IconeSeta, IconeUsuario } from "@/components/ui/Icons";
import { ARENA, USUARIOS } from "@/lib/mock-data";
import { useApp } from "@/store/AppStore";

/**
 * Tela de login — mockada.
 *
 * Nao ha autenticacao real: qualquer entrada (ou o botao direto) leva ao
 * Dashboard. A escolha de colaborador existe para reforcar o conceito de
 * acesso individual levantado na Reuniao Diagnostica.
 *
 * Visual deliberadamente limpo: fundo branco e marca centralizada, sem
 * elementos decorativos competindo com o formulario.
 */
export default function PaginaLogin() {
  const router = useRouter();
  const { entrar } = useApp();
  const [usuarioId, setUsuarioId] = useState(USUARIOS[0].id);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  function acessar(evento?: FormEvent) {
    evento?.preventDefault();
    entrar(usuarioId);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <Logo className="mx-auto h-28 w-auto" />

        <h1 className="mt-10 text-center text-xl font-semibold text-areia-900">
          Acesse sua conta
        </h1>
        <p className="mt-1.5 text-center text-sm text-areia-500">
          Cada colaborador entra com o próprio acesso.
        </p>

        <form onSubmit={acessar} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-areia-500">
              Perfil de acesso
            </label>
            <div className="grid gap-2">
              {USUARIOS.map((u) => {
                const ativo = u.id === usuarioId;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setUsuarioId(u.id);
                      setLogin(u.usuario);
                    }}
                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                      ativo
                        ? "border-saibro-500 bg-saibro-50 ring-2 ring-saibro-500/20"
                        : "border-areia-200 bg-white hover:border-saibro-300"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        ativo
                          ? "bg-saibro-600 text-white"
                          : "bg-areia-100 text-areia-600"
                      }`}
                    >
                      {u.nome
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-areia-900">
                        {u.nome}
                      </span>
                      <span className="block truncate text-xs text-areia-500">
                        {u.cargo}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="login"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-500"
            >
              Usuário
            </label>
            <div className="relative">
              <IconeUsuario className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-areia-400" />
              <input
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="usuario"
                autoComplete="off"
                className="campo pl-9"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-500"
            >
              Senha
            </label>
            <div className="relative">
              <IconeCadeado className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-areia-400" />
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
                className="campo pl-9"
              />
            </div>
          </div>

          <button type="submit" className="btn-primario w-full">
            Entrar no sistema
            <IconeSeta className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-areia-400">
          {ARENA.endereco} · {ARENA.horarioFuncionamento}
        </p>
      </div>
    </div>
  );
}
