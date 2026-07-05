"use client";

import { useState, FormEvent } from "react";
import { BrandMark } from "./BrandMark";

type Estado = "form" | "enviando" | "sucesso" | "erro";

const CAMPOS_INICIAIS = {
  drive_folder_origem: "",
  cid: "",
  nome_condominio: "",
  email_destino: "",
};

export function SubmitForm() {
  const [campos, setCampos] = useState(CAMPOS_INICIAIS);
  const [estado, setEstado] = useState<Estado>("form");
  const [erro, setErro] = useState<string | null>(null);

  function atualizar(campo: keyof typeof campos, valor: string) {
    setCampos((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setErro(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campos),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErro(data.error || "Não foi possível iniciar o processamento.");
        setEstado("erro");
        return;
      }

      setEstado("sucesso");
    } catch {
      setErro("Não foi possível conectar. Tente novamente.");
      setEstado("erro");
    }
  }

  function novaSubmissao() {
    setCampos(CAMPOS_INICIAIS);
    setEstado("form");
    setErro(null);
  }

  if (estado === "sucesso") {
    return (
      <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(15,27,51,0.06),0_8px_24px_rgba(15,27,51,0.08)] p-10 flex flex-col items-center text-center gap-4">
        <BrandMark className="w-8 h-8 text-green-600" />
        <div>
          <h2 className="font-display font-bold text-lg text-navy-900">
            Processamento iniciado
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 max-w-xs">
            Você receberá um e-mail de resumo em{" "}
            <span className="font-medium text-navy-900">{campos.email_destino}</span> assim
            que o lote for concluído.
          </p>
        </div>
        <button
          onClick={novaSubmissao}
          className="mt-2 rounded-full border border-slate-300 text-navy-900 font-semibold px-5 py-2 text-sm hover:border-blue-600 hover:text-blue-600 transition-colors"
        >
          Enviar outra pasta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(15,27,51,0.06),0_8px_24px_rgba(15,27,51,0.08)] p-8 flex flex-col gap-5"
    >
      <div>
        <h1 className="font-display font-bold text-xl text-navy-900">
          Enviar folhas de ponto
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Informe a pasta do Drive com as fotos e para onde mandar o resumo.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pasta do Drive de origem
        </span>
        <input
          type="text"
          required
          placeholder="Link ou ID da pasta no Google Drive"
          value={campos.drive_folder_origem}
          onChange={(e) => atualizar("drive_folder_origem", e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-navy-900 outline-none focus:border-blue-600 transition-colors"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            CID
          </span>
          <input
            type="text"
            required
            placeholder="0001"
            value={campos.cid}
            onChange={(e) => atualizar("cid", e.target.value)}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-navy-900 outline-none focus:border-blue-600 transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nome do condomínio
          </span>
          <input
            type="text"
            required
            placeholder="Condomínio Solar"
            value={campos.nome_condominio}
            onChange={(e) => atualizar("nome_condominio", e.target.value)}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-navy-900 outline-none focus:border-blue-600 transition-colors"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          E-mail de destino
        </span>
        <input
          type="email"
          required
          placeholder="voce@bbz.com.br"
          value={campos.email_destino}
          onChange={(e) => atualizar("email_destino", e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-navy-900 outline-none focus:border-blue-600 transition-colors"
        />
        <span className="text-xs text-slate-500">Recebe o e-mail de resumo quando terminar.</span>
      </label>

      {estado === "erro" && erro && (
        <p role="alert" className="text-sm text-red-600">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-2 rounded-full bg-blue-600 text-white font-semibold py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2.5"
      >
        {estado === "enviando" ? (
          <>
            <BrandMark className="w-3.5 h-3.5" animate />
            Enviando...
          </>
        ) : (
          "Enviar para processamento"
        )}
      </button>
    </form>
  );
}
