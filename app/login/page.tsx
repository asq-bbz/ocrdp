"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "../components/BrandMark";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Não foi possível entrar.");
        setEnviando(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErro("Não foi possível conectar. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <BrandMark className="w-6 h-6 text-navy-900" />
          <span className="font-display font-bold text-lg text-navy-900">
            OCR Folha de Ponto
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(15,27,51,0.06),0_8px_24px_rgba(15,27,51,0.08)] p-8 flex flex-col gap-5"
        >
          <div>
            <h1 className="font-display font-bold text-xl text-navy-900">
              Entrar
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Acesso restrito à equipe BBZ.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Usuário
            </span>
            <input
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-navy-900 outline-none focus:border-blue-600 transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Senha
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-navy-900 outline-none focus:border-blue-600 transition-colors"
            />
          </label>

          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-full bg-blue-600 text-white font-semibold py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
