"use client";

import React, { useMemo } from 'react';
import { useCampaign } from '@/store/CampaignStore';
import { Crown, Link2 } from 'lucide-react';

export function LeadershipMap() {
  const { filteredData } = useCampaign();

  const leaders = useMemo(() => {
    const leaderCounts = filteredData.reduce((acc, curr) => {
      if (curr.liderancas && curr.liderancas.length > 0) {
        curr.liderancas.forEach(lider => {
          if (!acc[lider]) {
              acc[lider] = {
                  name: lider,
                  count: 0,
                  cities: new Set<string>()
              };
          }
          
          acc[lider].count += 1;
          if(curr.cidade) acc[lider].cities.add(curr.cidade);
        });
      }
      return acc;
    }, {} as Record<string, { name: string, count: number, cities: Set<string> }>);

    return Object.values(leaderCounts)
      .map(leader => ({
        ...leader,
        citiesCount: leader.cities.size
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Show top 5

  }, [filteredData]);

  if (leaders.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col min-h-[300px] animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Crown className="text-purple-500" size={20} />
          Capilaridade de Lideranças (Top 5)
        </h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
          {leaders.map((leader, i) => (
             <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all hover:border-podemos-blue/30 group">
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-podemos-blue dark:group-hover:text-blue-400 transition-colors">{leader.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                             {leader.count} liderados
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                             <Link2 size={10} className="text-purple-400"/>
                             Presente em {leader.citiesCount} {leader.citiesCount === 1 ? 'Município' : 'Municípios'}
                        </span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 text-xs">
                    #{i + 1}
                </div>
             </div>
          ))}
      </div>
    </div>
  );
}
