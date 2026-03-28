"use client";

import React, { useRef } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { Upload, FileType, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";

export function DataUploader() {
  const { loadData, isLoaded, isLoading, error, data } = useCampaign();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await loadData(file);
    } catch (err) {
      console.error("Failed to load file", err);
    }
  };

  if (isLoaded) {
    const handleExportCSV = () => {
      // Format data back to CSV string
      const csvData = data.map(v => ({
        Nome: v.nome,
        Cidade: v.cidade,
        Bairro: v.bairro,
        Engajamento: v.engajamento,
        Posicao: v.posicao,
        Lideranca: v.liderancas ? v.liderancas.join(";") : "",
        Idade: v.idade || "",
        Genero: v.genero || "",
        Telefone: v.telefone || "",
        Email: v.email || "",
        Tags: v.tags ? v.tags.join(";") : ""
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `base_eleitores_atualizada_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-podemos-green/30 dark:border-podemos-green/20 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-podemos-green rounded-full p-2 text-white">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Dados Sincronizados</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{data.length.toLocaleString()} eleitores carregados no sistema.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <button 
            onClick={handleExportCSV}
            className="w-full sm:w-auto text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap shadow-sm"
          >
            Exportar CSV
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto text-xs font-bold text-white bg-podemos-green dark:bg-podemos-blue px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-blue-600 transition-colors whitespace-nowrap shadow-sm"
          >
            Substituir Base
          </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv" 
          className="hidden" 
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center py-12 transition-colors">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-podemos-blue dark:text-blue-400 mb-4">
        {isLoading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {isLoading ? "Processando base de dados..." : "Importe sua base de eleitores"}
      </h2>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        Faça o upload da planilha (CSV) exportada para visualizar a distribuição geográfica, engajamento e as métricas da sua campanha.
      </p>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg mb-6 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".csv" 
        className="hidden" 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center gap-2 text-white bg-podemos-blue dark:bg-gray-700 hover:bg-podemos-blue/90 dark:hover:bg-gray-600 border border-transparent dark:border-gray-600 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <FileType size={20} />
        <span>Selecionar Arquivo CSV</span>
      </button>
      
      <p className="text-xs text-gray-400 mt-4">Nenhum dado é enviado para a nuvem. Processamento 100% local no navegador.</p>
    </div>
  );
}
