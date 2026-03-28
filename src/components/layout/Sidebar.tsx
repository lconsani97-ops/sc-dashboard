"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Map as MapIcon, Settings, BarChart3, AlertCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-podemos-blue dark:bg-gray-900 border-r-0 dark:border-r dark:border-gray-800 text-white flex flex-col h-screen fixed top-0 left-0 hidden md:flex z-50 shadow-2xl transition-colors duration-200">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-podemos-green flex items-center justify-center font-bold text-white shadow-lg">
          SC
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Eleição 2026</h1>
          <p className="text-xs text-white/70">Comitê Central SC</p>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
            pathname === "/" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
        >
          <LayoutDashboard size={20} className={pathname === "/" ? "text-podemos-green" : "text-white/70"} />
          <span>Visão Geral</span>
        </Link>
        
        <div className="py-2.5">
          <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Engajamento (Em Breve)</p>
          <Link 
            href="/eleitores" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/eleitores" ? "bg-white/10 text-white font-medium" : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users size={20} className={pathname === "/eleitores" ? "text-podemos-green" : "text-white/70"} />
            <span>Base de Eleitores</span>
          </Link>

          <Link 
            href="/geopolitica" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/geopolitica" ? "bg-white/10 text-white font-medium" : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            <MapIcon size={20} className={pathname === "/geopolitica" ? "text-podemos-green" : "text-white/70"} />
            <span>Geopolítica Expandida</span>
          </Link>
          <Link 
            href="/indicadores"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/indicadores" ? "bg-white/10 text-white font-medium" : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            <BarChart3 size={20} className={pathname === "/indicadores" ? "text-podemos-green" : "text-white/70"} />
            <span>Indicadores & Metas</span>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <button onClick={() => alert('Em Breve: Configurações do Sistema')} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors text-left">
          <Settings size={20} />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
}
