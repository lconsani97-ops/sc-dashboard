"use client";

import React, { useMemo } from 'react';
import { useCampaign } from '@/store/CampaignStore';
import { LayoutList, Search } from 'lucide-react';

export function ZonalAnalysis() {
  const { filteredData } = useCampaign();

  const zones = useMemo(() => {
    const neighborhoodCounts = filteredData.reduce((acc, curr) => {
      if (curr.cidade && curr.bairro) {
        const key = `${curr.cidade} - ${curr.bairro}`;
        
        if (!acc[key]) {
          acc[key] = {
            city: curr.cidade,
            neighborhood: curr.bairro,
            count: 0,
            avgEngagement: 0,
            leaders: new Set<string>()
          };
        }
        
        acc[key].count += 1;
        acc[key].avgEngagement += curr.engajamento;
        if (curr.liderancas && curr.liderancas.length > 0) {
          curr.liderancas.forEach(lider => acc[key].leaders.add(lider));
        }
        
      }
      return acc;
    }, {} as Record<string, { city: string, neighborhood: string, count: number, avgEngagement: number, leaders: Set<string> }>);

    return Object.values(neighborhoodCounts)
      .map(zone => ({
        ...zone,
        avgEngagement: zone.count > 0 ? (zone.avgEngagement / zone.count).toFixed(1) : '---',
        leadersCount: zone.leaders.size
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Show top 10

  }, [filteredData]);

  if (zones.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col min-h-[300px] animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <LayoutList className="text-orange-500" size={20} />
          Análise de Redutos (Top 10)
        </h2>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/50">
            <tr>
              <th className="font-semibold py-2">Bairro - Cidade</th>
              <th className="font-semibold py-2">Apoiadores</th>
              <th className="font-semibold py-2">Engaj. Md.</th>
              <th className="font-semibold py-2">Qtd. Lideranças</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
            {zones.map((zone, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                <td className="py-2.5">
                  <div className="font-bold text-gray-800 dark:text-gray-200">{zone.neighborhood}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{zone.city}</div>
                </td>
                <td className="py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    {zone.count}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    Number(zone.avgEngagement) >= 4 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' :
                    Number(zone.avgEngagement) >= 3 ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                    'text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}>
                    {zone.avgEngagement}
                  </span>
                </td>
                <td className="py-2.5">
                  {zone.leadersCount > 0 ? (
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {zone.leadersCount} {zone.leadersCount === 1 ? 'líder' : 'líderes'}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">Nenhum mapeado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
