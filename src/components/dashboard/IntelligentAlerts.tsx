"use client";

import React, { useMemo } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { AlertTriangle, Lightbulb, TrendingUp, ShieldAlert } from "lucide-react";

export function IntelligentAlerts() {
  const { data } = useCampaign();
  
  const alerts = useMemo(() => {
    if (!data.length) return [];
    
    const messages = [];
    const META_VOTAIS = 40000;
    
    // 1. Goal Projection logic (Simple mock calculation)
    const currentTotal = data.length;
    if (currentTotal < META_VOTAIS * 0.1) {
      messages.push({
        type: "warning",
        icon: <TrendingUp size={20} className="text-orange-500" />,
        title: "Projeção de Meta Baixa",
        desc: `A base atual (${currentTotal}) representa menos de 10% da meta de ${META_VOTAIS} votos. Intensifique a captação de lideranças.`
      });
    }

    // 2. Uncovered Zones (Low engagement or zero representation in major SC cities)
    const citiesCount = data.reduce((acc, curr) => {
      const city = curr.cidade ? curr.cidade.trim().toLowerCase() : "";
      if (city) acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const checkCities = [
      { name: "Joinville", key: "joinville" },
      { name: "Florianópolis", key: "florianópolis" },
      { name: "Blumenau", key: "blumenau" },
      { name: "Chapecó", key: "chapecó" }
    ];

    const missingMajorCities = checkCities.filter(c => !citiesCount[c.key] && !citiesCount[c.name.toLowerCase()]);
    
    if (missingMajorCities.length > 0) {
      messages.push({
        type: "danger",
        icon: <ShieldAlert size={20} className="text-red-500" />,
        title: "Zonas Descobertas: Cidades Polo",
        desc: `Sem representatividade em: ${missingMajorCities.map(c => c.name).join(", ")}. Estas cidades representam um alto colégio eleitoral.`
      });
    }

    // 3. Low Engagement Ratio
    const lowEngagement = data.filter(d => d.engajamento <= 2).length;
    if (lowEngagement > currentTotal * 0.3) {
      messages.push({
        type: "info",
        icon: <Lightbulb size={20} className="text-blue-500" />,
        title: "Alerta de Engajamento Frio",
        desc: `Mais de 30% da sua base está classificada como 'Fria' (Nível 1 ou 2). Recomenda-se campanha de relacionamento via WhatsApp na próxima semana.`
      });
    }

    // Default positive message if everything is perfect
    if (messages.length === 0) {
       messages.push({
        type: "success",
        icon: <Lightbulb size={20} className="text-podemos-green" />,
        title: "Base Saudável",
        desc: "A distribuição e engajamento dos seus eleitores estão dentro dos parâmetros ideais rumo à vitória!"
      });
    }

    return messages;
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 bg-gradient-to-r from-podemos-blue/5 dark:from-podemos-blue/20 to-transparent">
        <Lightbulb className="text-podemos-blue dark:text-blue-400 fill-podemos-blue/20" size={20} />
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Inteligência Estratégica & Alertas</h3>
      </div>
      <div className="p-5 space-y-4">
        {alerts.map((alert, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 p-4 rounded-lg border ${
              alert.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50' : 
              alert.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/50' : 
              alert.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50' :
              'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/50'
            }`}
          >
            <div className="mt-0.5">{alert.icon}</div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{alert.title}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
