"use client";

import React from "react";
import { useCampaign } from "@/store/CampaignStore";
import { Users, Target, MapPin, TrendingUp } from "lucide-react";

export function SummaryCards() {
  const { filteredData, isLoaded } = useCampaign();

  // Constantes de meta (Podem virar configurações depois)
  const META_VOTOS = 40000;
  
  if (!isLoaded) return null;

  const totalEleitores = filteredData.length;
  // Se aplicamos filtro, a meta é fixa baseada no total geral? Normalmente sim, 
  // mas aqui queremos mostrar o progresso desse "segmento" em relação à meta total.
  const percentualMeta = ((totalEleitores / META_VOTOS) * 100).toFixed(1);
  
  // Calcula engajamento alto (4 ou 5)
  const engajados = filteredData.filter(d => d.engajamento >= 4).length;
  const taxaEngajamento = totalEleitores > 0 ? ((engajados / totalEleitores) * 100).toFixed(1) : "0";

  // Cidades únicas
  const cidadesAlcancadas = new Set(filteredData.filter(d => d.cidade).map(d => d.cidade)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-tight">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:border-podemos-green/50 dark:hover:border-podemos-green/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-podemos-blue dark:text-blue-400">
            <Users size={24} />
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-green-50 dark:bg-green-900/30 text-podemos-green dark:text-green-400">+120 hoje</span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Exibido</h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalEleitores.toLocaleString()}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:border-podemos-green/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-podemos-green dark:text-green-400">
            <Target size={24} />
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">Meta: 40k</span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Impacto na Meta</h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{percentualMeta}%</p>
        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 mt-3 rounded-full overflow-hidden">
          <div 
            className="bg-podemos-green h-full" 
            style={{ width: `${Math.min(100, parseFloat(percentualMeta))}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:border-podemos-green/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">Scores 4 e 5</span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Conversão Segmento</h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{taxaEngajamento}%</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{engajados.toLocaleString()} eleitores certos</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:border-podemos-green/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <MapPin size={24} />
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">De 295</span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Cidades Envolvidas</h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{cidadesAlcancadas}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Cobertura geográfica no recorte</p>
      </div>
    </div>
  );
}
