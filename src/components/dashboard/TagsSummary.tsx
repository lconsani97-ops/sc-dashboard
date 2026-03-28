"use client";

import React, { useMemo } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { Tag as TagIcon, ArrowRight } from "lucide-react";

export function TagsSummary() {
  const { data } = useCampaign();

  const tagsData = useMemo(() => {
    if (!data.length) return [];

    const conteoTags: Record<string, number> = {};
    
    data.forEach(voter => {
      if (voter.tags && Array.isArray(voter.tags)) {
        voter.tags.forEach(tag => {
          conteoTags[tag] = (conteoTags[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(conteoTags)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 tags
  }, [data]);

  if (tagsData.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <TagIcon className="text-podemos-blue dark:text-blue-400" size={20} />
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Top Segmentações (Tags)</h3>
         </div>
         <a href="/eleitores" className="text-sm text-podemos-blue dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline">
            Ver Base <ArrowRight size={14} />
         </a>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {tagsData.map((tag, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 flex-grow min-w-[140px]"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{tag.name}</span>
              <span className="bg-podemos-green/10 dark:bg-podemos-green/20 text-podemos-green dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {tag.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
