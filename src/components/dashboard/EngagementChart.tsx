"use client";

import React, { useMemo } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export function EngagementChart() {
  const { filteredData, filters, setFilter } = useCampaign();

  const chartData = useMemo(() => {
    const counts: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    filteredData.forEach(d => {
      const level = d.engajamento;
      if (counts[level] !== undefined) {
        counts[level]++;
      } else {
        counts[3]++; // Default for invalid
      }
    });

    return [
      { level: 1, name: "1 - Muito Frio", count: counts[1], color: "#ef4444" }, // Red
      { level: 2, name: "2 - Frio", count: counts[2], color: "#f97316" }, // Orange
      { level: 3, name: "3 - Neutro", count: counts[3], color: "#eab308" }, // Yellow
      { level: 4, name: "4 - Quente", count: counts[4], color: "#84cc16" }, // Light Green
      { level: 5, name: "5 - Engajado", count: counts[5], color: "#009b3a" }, // Podemos Green
    ];
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{label}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {payload[0].value} eleitores
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Clique para filtrar</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (data && data.level) {
      setFilter('engajamento', data.level);
    }
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            width={100}
          />
          <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[0, 4, 4, 0]} 
            barSize={32}
            onClick={handleBarClick}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            {chartData.map((entry, index) => {
              const isActive = filters.engajamento === entry.level;
              const hasFilter = filters.engajamento !== undefined;
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={hasFilter && !isActive ? 0.3 : 1}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
