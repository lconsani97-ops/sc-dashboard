"use client";

import React, { useMemo } from 'react';
import { useCampaign } from '@/store/CampaignStore';
import { DynamicMap } from '@/components/dashboard/MapWrapper';
import { MapPin } from 'lucide-react';

export function GeopoliticsMap() {
  const { filteredData } = useCampaign();

  // Similar to StateMap but optimized for the geopolitics view
  const cityData = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      if (curr.cidade) {
        acc[curr.cidade] = (acc[curr.cidade] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([city, count]) => ({ city, count }));
  }, [filteredData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[600px] animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="text-podemos-green" size={20} />
            Densidade Eleitoral por Município
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualização de {cityData.length} municípios com presença mapeada.
          </p>
        </div>
      </div>
      
      <div className="flex-1 w-full relative rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* We reuse the DynamicMap here which internally uses StateMap */}
        <DynamicMap />
        
        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm z-[1000] pointer-events-none">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Concentração</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-900/50"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Emergente</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-500/80"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Consolidado</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full bg-podemos-green dark:bg-green-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Reduto Forte</span>
          </div>
        </div>
      </div>
    </div>
  );
}
