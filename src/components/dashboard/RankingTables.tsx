"use client";

import React, { useMemo } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { Users, MapPin } from "lucide-react";

export function RankingTables() {
  const { filteredData, filters, setFilter } = useCampaign();

  const cityRanking = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      const city = curr.cidade || "Não informada";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, percent: (count / filteredData.length) * 100 }));
  }, [filteredData]);

  const neighborhoodRanking = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      // Usamos apenas o bairro propriamente dito para o filtro funcionar bem, 
      // mas mostramos a cidade junto na UI se quisermos. 
      // Para o filtro funcionar direto no banco de dados, precisamos da string exata do bairro.
      const locationKey = curr.bairro || "Não informado";
      const displayLabel = curr.bairro && curr.cidade 
        ? `${curr.bairro} (${curr.cidade})` 
        : locationKey;
      
      // key = nome do bairro real para filtrar. label = display.
      const key = JSON.stringify({ key: locationKey, label: displayLabel });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([jsonStr, count]) => {
        const parsed = JSON.parse(jsonStr);
        return { 
          key: parsed.key, 
          name: parsed.label, 
          count, 
          percent: (count / filteredData.length) * 100 
        };
      });
  }, [filteredData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <MapPin className="text-podemos-green" size={18} />
          <h3 className="font-bold text-gray-800 dark:text-gray-100">Top 5 Municípios</h3>
        </div>
        <div className="p-5">
          <ul className="space-y-4">
            {cityRanking.map((city, index) => {
              const isActive = filters.cidade === city.name;
              return (
                <li 
                  key={city.name} 
                  className={`flex flex-col gap-1 p-2 -mx-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-green-50 dark:bg-green-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => setFilter('cidade', city.name)}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${isActive ? 'text-podemos-green dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span className="text-gray-400 dark:text-gray-500 mr-2">{index + 1}.</span>
                      {city.name}
                    </span>
                    <span className={`font-bold ${isActive ? 'text-podemos-green dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{city.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`${isActive ? 'bg-podemos-green' : 'bg-podemos-green/70'} h-full rounded-full transition-all`} 
                      style={{ width: `${Math.max(city.percent, 2)}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
            {cityRanking.length === 0 && <li className="text-sm text-gray-400">Sem dados</li>}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <Users className="text-podemos-blue" size={18} />
          <h3 className="font-bold text-gray-800 dark:text-gray-100">Top 5 Bairros</h3>
        </div>
        <div className="p-5">
          <ul className="space-y-4">
            {neighborhoodRanking.map((bairro, index) => {
              const isActive = filters.bairro === bairro.key;
              return (
                <li 
                  key={bairro.key} 
                  className={`flex flex-col gap-1 p-2 -mx-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => setFilter('bairro', bairro.key)}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium truncate pr-4 ${isActive ? 'text-podemos-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span className="text-gray-400 dark:text-gray-500 mr-2">{index + 1}.</span>
                      {bairro.name}
                    </span>
                    <span className={`font-bold ${isActive ? 'text-podemos-blue dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>{bairro.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`${isActive ? 'bg-podemos-blue' : 'bg-podemos-blue/70'} h-full rounded-full transition-all`} 
                      style={{ width: `${Math.max(bairro.percent, 2)}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
            {neighborhoodRanking.length === 0 && <li className="text-sm text-gray-400">Sem dados</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
