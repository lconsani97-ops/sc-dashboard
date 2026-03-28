"use client";

import { Users, Map as MapIcon, X, Filter } from "lucide-react";
import { DataUploader } from "@/components/upload/DataUploader";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RankingTables } from "@/components/dashboard/RankingTables";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { useCampaign } from "@/store/CampaignStore";
import { DynamicMap } from "@/components/dashboard/MapWrapper";
import { IntelligentAlerts } from "@/components/dashboard/IntelligentAlerts";
import { TagsSummary } from "@/components/dashboard/TagsSummary";
import { DashboardVoterList } from "@/components/dashboard/DashboardVoterList";

export default function Home() {
  const { isLoaded, filters, clearFilters, setFilter } = useCampaign();

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral da Base</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Painel de inteligência geopolítica - Eleições 2026</p>
        </div>
        
        {isLoaded && <DataUploader />}
      </div>
      
      {!isLoaded && (
        <DataUploader />
      )}
      
      {isLoaded && (
        <>
          {activeFiltersCount > 0 && (
            <div className="bg-podemos-blue/10 dark:bg-podemos-blue/20 border border-podemos-blue/20 dark:border-podemos-blue/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
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

          <SummaryCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col min-h-[400px]">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MapIcon className="text-podemos-green" size={20} />
                Mapa de Calor (Santa Catarina)
              </h2>
              <div className="flex-1 w-full relative min-h-[400px]">
                <DynamicMap />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Users className="text-podemos-blue dark:text-blue-400" size={20} />
                Termômetro de Engajamento
              </h2>
              <div className="flex-1">
                <EngagementChart />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <RankingTables />
            </div>
            <div className="lg:col-span-1">
              <IntelligentAlerts />
              <TagsSummary />
            </div>
          </div>

          <DashboardVoterList />
        </>
      )}
    </div>
  );
}
