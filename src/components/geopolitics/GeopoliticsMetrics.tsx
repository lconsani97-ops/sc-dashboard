"use client";

import React, { useMemo } from 'react';
import { useCampaign } from '@/store/CampaignStore';
import { MapPin, Users, Crown, Target } from 'lucide-react';

export function GeopoliticsMetrics() {
  const { filteredData } = useCampaign();

  const metrics = useMemo(() => {
    if (!filteredData.length) return null;

    const cities = new Set(filteredData.map(d => d.cidade).filter(Boolean));
    const neighborhoods = new Set(filteredData.map(d => `${d.cidade}-${d.bairro}`).filter(d => !d.endsWith('undefined')));
    
    // Top Stronghold (Reduto)
    const neighborhoodCounts = filteredData.reduce((acc, curr) => {
      if (curr.cidade && curr.bairro) {
        const key = `${curr.cidade} - ${curr.bairro}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topStronghold = Object.entries(neighborhoodCounts).sort((a, b) => b[1] - a[1])[0];

    // Top Leader
    const leaderCounts = filteredData.reduce((acc, curr) => {
      if (curr.liderancas && curr.liderancas.length > 0) {
        curr.liderancas.forEach(lider => {
          acc[lider] = (acc[lider] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topLeader = Object.entries(leaderCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      citiesCount: cities.size,
      neighborhoodsCount: neighborhoods.size,
      topStronghold: topStronghold ? { name: topStronghold[0], count: topStronghold[1] } : null,
      topLeader: topLeader ? { name: topLeader[0], count: topLeader[1] } : null
    };
  }, [filteredData]);

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <MapPin size={20} className="text-podemos-blue dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cobertura Municipal</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.citiesCount} <span className="text-sm font-normal text-gray-500">cidades</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <Target size={20} className="text-podemos-green" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Penetração Zonal</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.neighborhoodsCount} <span className="text-sm font-normal text-gray-500">bairros</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
          <Users size={20} className="text-orange-600 dark:text-orange-400" />
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Reduto Principal</p>
          {metrics.topStronghold ? (
            <>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate" title={metrics.topStronghold.name}>{metrics.topStronghold.name}</p>
              <p className="text-xs text-podemos-blue dark:text-blue-400 font-semibold mt-0.5">{metrics.topStronghold.count} apoiadores</p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-2 italic">Dados insuficientes</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
          <Crown size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Liderança Dominante</p>
          {metrics.topLeader ? (
            <>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate" title={metrics.topLeader.name}>{metrics.topLeader.name}</p>
              <p className="text-xs text-podemos-blue dark:text-blue-400 font-semibold mt-0.5">{metrics.topLeader.count} mapeados</p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-2 italic">Nenhuma liderança</p>
          )}
        </div>
      </div>
    </div>
  );
}
