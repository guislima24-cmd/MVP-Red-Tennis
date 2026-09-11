"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/layout/Logo";
import { Quadra3D } from "@/components/dashboard/Quadra3D";
import { IconeBola, IconeCadeado, IconeSeta, IconeUsuario } from "@/components/ui/Icons";
import { ARENA, USUARIOS } from "@/lib/mock-data";
import { useApp } from "@/store/AppStore";

/**
 * Tela de login — mockada.
 *
 * Nao ha autenticacao real: qualquer entrada (ou o botao direto) leva ao
 * Dashboard. A escolha de colaborador existe para reforcar o conceito de
 * acesso individual levantado na Reuniao Diagnostica.
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
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Painel da marca */}
      <section className="relative flex min-h-[280px] flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-saibro-800 via-saibro-900 to-areia-900 px-8 py-10 text-white lg:px-14 lg:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(600px 320px at 20% 10%, rgba(240,179,132,0.45), transparent 65%), radial-gradient(520px 320px at 95% 85%, rgba(163,42,28,0.5), transparent 60%)",
          }}
        />

        <div className="relative">
          <Logo variante="marca" className="h-12 w-auto" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.34em] text-saibro-200">
            Sistema de Gestão
          </p>
          <h1 className="mt-3 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
            A arena inteira em uma tela só.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-saibro-100/90">
            Agenda das quadras, ficha completa dos alunos, controle financeiro e
            ranking — sem planilha, sem papel e sem retrabalho.
          </p>

          <ul className="mt-8 grid max-w-md gap-2.5 text-sm text-saibro-100/90">
            {[
              "Ocupação das 4 quadras e do paredão em tempo real",
              "Agenda semanal com alerta automático de conflito",
              "Financeiro integrado a Stone, Bradesco e Total Pass",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <IconeBola className="mt-0.5 h-4 w-4 shrink-0 text-saibro-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quadras decorativas em perspectiva */}
        <div className="relative mt-10 hidden items-end justify-center gap-5 lg:flex">
          {[0.25, 0.62, 0.9, 0.45].map((taxa, i) => (
            <Quadra3D
              key={i}
              rotulo={String(i + 1)}
              taxa={taxa}
              inclinacao={62}
              className="w-[22%] opacity-90"
            />
          ))}
        </div>

        <p className="relative mt-8 text-xs text-saibro-200/80">
          {ARENA.endereco} · Funcionamento das {ARENA.horarioFuncionamento}
        </p>
      </section>

      {/* Formulario */}
      <section className="flex flex-1 items-center justify-center bg-areia-50 px-6 py-12 lg:max-w-[560px]">
        <div className="w-full max-w-sm animate-fade-up">
          <Logo className="mx-auto h-24 w-auto" />

          <h2 className="mt-8 text-center text-xl font-semibold text-areia-900">
            Acesse sua conta
          </h2>
          <p className="mt-1.5 text-center text-sm text-areia-600">
            Cada colaborador entra com o próprio acesso.
          </p>

          <form onSubmit={acessar} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-areia-600">
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
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-600"
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
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-areia-600"
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

          <p className="mt-6 rounded-xl border border-dashed border-areia-300 bg-white px-3.5 py-3 text-center text-xs leading-relaxed text-areia-500">
            Demonstração sem backend: o login não valida credenciais — qualquer
            entrada abre o sistema.
          </p>
        </div>
      </section>
    </div>
  );
}
