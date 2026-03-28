"use client";

import React, { useMemo } from 'react';
import { useCampaign } from '@/store/CampaignStore';
import { Map as MapIcon, Filter, X } from 'lucide-react';
import { GeopoliticsMetrics } from '@/components/geopolitics/GeopoliticsMetrics';
import { GeopoliticsMap } from '@/components/geopolitics/GeopoliticsMap';
import { ZonalAnalysis } from '@/components/geopolitics/ZonalAnalysis';
import { LeadershipMap } from '@/components/geopolitics/LeadershipMap';

export default function GeopoliticaPage() {
  const { isLoaded, filters, clearFilters, setFilter } = useCampaign();
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length;

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4 animate-fade-in">
        <MapIcon size={48} className="text-gray-300 dark:text-gray-600 mb-2" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Nenhum dado eleitoral carregado</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Por favor, importe uma base de eleitores na Visão Geral ou aguarde o carregamento dos painéis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Geopolítica Expandida</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Análise territorial detalhada de zonas, redutos eleitorais e lideranças.</p>
      </div>

      {activeFiltersCount > 0 && (
        <div className="bg-podemos-blue/10 dark:bg-podemos-blue/20 border border-podemos-blue/20 dark:border-podemos-blue/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 sm:pb-0">
            <div className="flex items-center gap-1.5 text-podemos-blue dark:text-blue-400 font-semibold whitespace-nowrap">
              <Filter size={18} />
              <span>Filtros Ativos:</span>
            </div>
            
            <div className="flex items-center gap-2 flex-nowrap">
              {filters.cidade && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm border border-gray-200 dark:border-gray-700 shadow-sm whitespace-nowrap">
                  <span className="text-gray-400 dark:text-gray-500">Cidade:</span> {filters.cidade}
                  <button onClick={() => setFilter('cidade', undefined)} className="ml-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"><X size={14}/></button>
                </span>
              )}
              {filters.bairro && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm border border-gray-200 dark:border-gray-700 shadow-sm whitespace-nowrap">
                  <span className="text-gray-400 dark:text-gray-500">Bairro:</span> {filters.bairro}
                  <button onClick={() => setFilter('bairro', undefined)} className="ml-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"><X size={14}/></button>
                </span>
              )}
              {filters.engajamento !== undefined && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm border border-gray-200 dark:border-gray-700 shadow-sm whitespace-nowrap">
                  <span className="text-gray-400 dark:text-gray-500">Score:</span> {filters.engajamento}
                  <button onClick={() => setFilter('engajamento', undefined)} className="ml-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"><X size={14}/></button>
                </span>
              )}
              {filters.tag && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm border border-gray-200 dark:border-gray-700 shadow-sm whitespace-nowrap">
                  <span className="text-gray-400 dark:text-gray-500">Tag:</span> {filters.tag}
                  <button onClick={() => setFilter('tag', undefined)} className="ml-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"><X size={14}/></button>
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={clearFilters}
            className="text-sm font-medium text-podemos-blue hover:text-blue-800 whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-podemos-blue/10 transition-colors"
          >
            Limpar Todos
          </button>
        </div>
      )}

      {/* Geopolitics Specialized Components */}
      <GeopoliticsMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <GeopoliticsMap />
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
           <ZonalAnalysis />
           <LeadershipMap />
        </div>
      </div>
    </div>
  );
}
