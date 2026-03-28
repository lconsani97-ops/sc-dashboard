"use client";

import React, { useState } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { Users, Phone, MapPin, ChevronRight, Tag, Star, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardVoterList() {
  const { filteredData, filters, setFilter, setSelectedVoterId } = useCampaign();
  const [displayLimit, setDisplayLimit] = useState(10);
  const router = useRouter();

  // If there's no data, don't show the list
  if (filteredData.length === 0) return null;

  const displayedVoters = filteredData.slice(0, displayLimit);

  const getEngagementColor = (level: number) => {
    switch(level) {
      case 5: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case 4: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case 3: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case 2: return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case 1: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getEngagementLabel = (level: number) => {
    switch(level) {
      case 5: return "Forte (5)";
      case 4: return "Bom (4)";
      case 3: return "Médio (3)";
      case 2: return "Baixo (2)";
      case 1: return "Frio (1)";
      default: return "N/D";
    }
  };

  const getPositionLabel = (level: number) => {
    switch(level) {
      case 5: return "Liderança/Coordenador";
      case 4: return "Líder de Bairro";
      case 3: return "Multiplicador";
      case 2: return "Apoiador Ativo";
      case 1: return "Eleitor Comum";
      default: return "Eleitor Comum";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden mt-6 animate-fade-in">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Users className="text-podemos-blue dark:text-blue-400" size={20} />
            Recortes de Relacionamento (CRM)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualizando {displayedVoters.length} de {filteredData.length} perfis que correspondem aos filtros atuais.
          </p>
        </div>
        
        {/* Helper text linking to main base */}
        <Link 
          href="/eleitores"
          className="text-sm font-medium text-podemos-blue dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
        >
          Gestão Completa <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Eleitor & Score</th>
              <th className="px-6 py-4 font-semibold">Localização</th>
              <th className="px-6 py-4 font-semibold">Perfil Político</th>
              <th className="px-6 py-4 font-semibold">Contato</th>
              <th className="px-6 py-4 font-semibold">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {displayedVoters.map((voter) => (
              <tr 
                key={voter.id} 
                className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedVoterId(voter.id);
                  router.push("/eleitores");
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                       {voter.nome}
                       {voter.voterScore > 0 && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-700/50" title="CRM Score">
                            <Award size={10} />
                            {voter.voterScore} pts
                          </span>
                       )}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">ID: {voter.id.split('_')[1]}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium">{voter.cidade}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 ml-5">
                    {voter.bairro}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5 items-start">
                    
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Star size={12} className={voter.posicao > 3 ? "text-podemos-blue" : "text-gray-400"} />
                      {getPositionLabel(voter.posicao)}
                    </span>

                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getEngagementColor(voter.engajamento)}`}>
                      {getEngagementLabel(voter.engajamento)}
                    </span>
                    {voter.liderancas && voter.liderancas.length > 0 && (
                      <span className="text-xs font-medium text-podemos-blue dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded truncate max-w-[150px]" title={`Liderado por: ${voter.liderancas.join(', ')}`}>
                        Liderado por: {voter.liderancas[0]} {voter.liderancas.length > 1 && `(+${voter.liderancas.length - 1})`}
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  {voter.telefone || voter.email ? (
                    <div className="flex flex-col gap-1">
                      {voter.telefone && (
                        <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
                          <Phone size={12} className="text-gray-400" />
                          {voter.telefone}
                        </span>
                      )}
                      {voter.email && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {voter.email}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 italic text-xs">Não cadastrado</span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                    {voter.tags && voter.tags.length > 0 ? (
                      <>
                        {voter.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-600">
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                        {voter.tags.length > 2 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium ml-1">
                            +{voter.tags.length - 2}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 italic text-xs">Nenhuma tag</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length > displayLimit && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-center">
          <button 
            onClick={() => setDisplayLimit(prev => prev + 20)}
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-podemos-blue dark:hover:text-blue-400 transition-colors"
          >
            Carregar mais dados
          </button>
        </div>
      )}
    </div>
  );
}
