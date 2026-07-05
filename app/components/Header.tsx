"use client";

import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-navy-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="w-5 h-5" />
          <div className="leading-tight">
            <p className="font-display font-bold text-sm">
              OCR Folha de Ponto
            </p>
            <p className="text-[11px] text-slate-300">BBZ Administração de Condomínios</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-300 hover:text-white transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
