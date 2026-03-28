"use client";

import React, { useState } from "react";
import { 
  Trophy, TrendingUp, Target, Award, Heart, BookOpen, 
  ShieldCheck, Briefcase, Leaf, Bus, Landmark, X, FileText, 
  Printer, Link as LinkIcon, CalendarCheck, Zap, CheckCircle, 
  ArrowRight, ShieldAlert, Table as TableIcon, Layers
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  BarChart, Bar, Cell
} from 'recharts';

import { 
  comparisonAxes, kpisMock, executionDataMock, 
  historicalRankingsMock, radarDataMock, 
  StatusColor, MetricMapping, NO_MATCH_TEXT 
} from "../../data/mockIndicadores";

export default function IndicadoresPage() {
  const [activeTab, setActiveTab] = useState(comparisonAxes[0].id);
  const activeAxisData = comparisonAxes.find(a => a.id === activeTab);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'MEMO_GERENCIAL' | 'PURE_TABLE'>('MEMO_GERENCIAL');
  const [reportView, setReportView] = useState(false); 
  
  const [selectedAxes, setSelectedAxes] = useState<string[]>(comparisonAxes.map(a => a.id));
  const [reportPeriod, setReportPeriod] = useState('2020-2025');

  const toggleAxisSelection = (id: string) => {
    setSelectedAxes(prev => 
      prev.includes(id) ? prev.filter(axis => axis !== id) : [...prev, id]
    );
  };

  const handleGenerateReport = (type: 'MEMO_GERENCIAL' | 'PURE_TABLE') => {
    setReportType(type);
    setIsReportModalOpen(false);
    setReportView(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColorClass = (status: StatusColor, isText = false) => {
    switch (status) {
      case 'green': return isText ? 'text-emerald-600 dark:text-emerald-400' : 'bg-emerald-500';
      case 'yellow': return isText ? 'text-yellow-600 dark:text-yellow-400' : 'bg-yellow-500';
      case 'red': return isText ? 'text-rose-600 dark:text-rose-400' : 'bg-rose-500';
      default: return isText ? 'text-gray-600' : 'bg-gray-500';
    }
  };

  const isNoMatch = (text: string) => text === NO_MATCH_TEXT;

  // --- ORIGINAL 4-COLUMN BULLET LIST UI (RESTORED AS REQUESTED) ---
  const restoredFourColumnSummary = (axis: typeof comparisonAxes[0]) => (
    <div className="mt-8 mb-8 pb-8 border-b-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
         <Layers className="text-blue-600" size={20} />
         <h3 className="font-extrabold text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Quadros de Indicadores Base ({axis.title})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-3 text-sm">Floripa em Números</h4>
          <ul className="space-y-2">
            {axis.floripaNumeros.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-xs flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"/> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
          <h4 className="font-bold text-emerald-900 mb-3 text-sm">Smart Cities (CSC)</h4>
          <ul className="space-y-2">
            {axis.smartCities.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-xs flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"/> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-yellow-50/50 p-5 rounded-xl border border-yellow-100">
          <h4 className="font-bold text-yellow-900 mb-3 text-sm">Ranking CLP</h4>
          <ul className="space-y-2">
            {axis.clp.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-xs flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0"/> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-100 p-5 rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3 text-sm">Plano PMF</h4>
          <ul className="space-y-2">
            {axis.planoMetas.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-xs flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"/> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // Exact Mapping Table UI Component
  const ExactMappingTable = ({ explicitMap, isPureTabletMode = false }: { explicitMap: MetricMapping[], isPureTabletMode?: boolean }) => {
    
    if (isPureTabletMode) {
      // PREVENT PDF DEFORMATION: HTML Table instead of Grid
      return (
        <table className="w-full mt-4 bg-white border-2 border-gray-900 text-left text-xs break-inside-auto table-fixed print:text-[10px]">
          <thead className="bg-gray-200 border-b-2 border-gray-900 uppercase tracking-wider text-[10px] print:text-[8px] print:bg-gray-200 shadow-sm">
             <tr>
               <th className="p-3 print:p-2 border-r border-gray-400 w-1/5 bg-gray-600 text-white break-words">Categoria/Tema Avaliado</th>
               <th className="p-3 print:p-2 border-r border-gray-400 w-1/5 text-gray-900 break-words">Meta Mun. (PMF)</th>
               <th className="p-3 print:p-2 border-r border-gray-400 w-1/5 text-blue-900 break-words">Floripa em Números</th>
               <th className="p-3 print:p-2 border-r border-gray-400 w-1/5 text-yellow-900 break-words">Instituíto CLP</th>
               <th className="p-3 print:p-2 w-1/5 text-emerald-900 break-words">Smart Cities (CSC)</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
             {explicitMap.map((mapData, i) => (
               <tr key={i} className={`border-b border-gray-300 break-inside-avoid ${mapData.isGap ? 'bg-rose-50/50 print:bg-rose-50' : 'bg-white'}`}>
                  <td className="p-3 print:p-2 border-r border-gray-300 font-bold bg-gray-100/50 print:bg-gray-100 break-words align-top">{mapData.theme}</td>
                  <td className={`p-3 print:p-2 border-r border-gray-300 break-words align-top ${isNoMatch(mapData.pmf) ? 'text-rose-600 italic font-medium' : 'text-gray-800'}`}>
                    {mapData.isGap && <span className="block mb-1 bg-rose-500 text-white text-[8px] print:text-[6px] px-1 rounded uppercase font-black w-max">Alerta Hiato</span>}
                    {mapData.pmf}
                  </td>
                  <td className={`p-3 print:p-2 border-r border-gray-300 break-words align-top ${isNoMatch(mapData.phen) ? 'text-rose-600 italic font-medium' : 'text-gray-800'}`}>{mapData.phen}</td>
                  <td className={`p-3 print:p-2 border-r border-gray-300 break-words align-top ${isNoMatch(mapData.clp) ? 'text-rose-600 italic font-medium' : 'text-gray-800'}`}>{mapData.clp}</td>
                  <td className={`p-3 print:p-2 break-words align-top ${isNoMatch(mapData.csc) ? 'text-rose-600 italic font-medium' : 'text-gray-800'}`}>{mapData.csc}</td>
               </tr>
             ))}
          </tbody>
        </table>
      );
    }

    // DASHBOARD RICH COMPONENT
    return (
      <div className="w-full mt-6 bg-white border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center gap-2 print:hidden">
           <LinkIcon size={16} className="text-white shrink-0"/>
           <h3 className="font-bold text-sm text-white uppercase tracking-widest break-words overflow-hidden">Relação Explícita de Correspondência e Gaps (Matriz Direta 1 para 1)</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 print:divide-gray-300">
           {explicitMap.map((mapData, i) => (
             <div key={i} className={`flex flex-col break-inside-avoid print:mb-1 ${mapData.isGap ? 'bg-rose-50/40 dark:bg-rose-900/10 print:bg-rose-50/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {/* Theme Header Bar (Dashboard) */}
                <div className="flex items-center gap-3 p-6 pb-2 print:p-2 print:pb-1">
                   <div className={`shrink-0 w-8 h-8 print:w-5 print:h-5 flex items-center justify-center rounded-lg shadow-sm border ${mapData.isGap ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'}`}>
                      {mapData.isGap ? <ShieldAlert size={16} className="print:w-3 print:h-3"/> : <CheckCircle size={16} className="print:w-3 print:h-3"/>}
                   </div>
                   <h4 className={`text-lg print:text-xs font-black tracking-tight ${mapData.isGap ? 'text-rose-900 dark:text-rose-200' : 'text-gray-900 dark:text-white'}`}>
                      {mapData.theme}
                   </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6 pt-4 print:grid-cols-4 print:gap-2 print:p-2 print:pt-1">
                   <div className={`p-4 print:p-2 rounded-lg border-2 ${isNoMatch(mapData.pmf) ? 'border-dashed border-rose-300 bg-rose-50/50 dark:bg-rose-900/10' : mapData.isGap ? 'border-dashed border-rose-400 bg-rose-50 dark:bg-rose-900/20' : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
                      <span className="block text-xs print:text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 print:mb-1 flex items-center gap-1 justify-between">
                         Meta Oficial PMF
                         {mapData.isGap && <span className="bg-rose-500 text-white text-[9px] print:text-[7px] px-1.5 print:px-1 rounded uppercase font-black">Alerta Hiato</span>}
                      </span>
                      <p className={`font-semibold text-sm print:text-[10px] print:leading-tight leading-relaxed ${isNoMatch(mapData.pmf) ? 'text-rose-500 italic' : mapData.isGap ? 'text-rose-700 dark:text-rose-300 italic' : 'text-gray-900 dark:text-gray-100'}`}>
                        {mapData.pmf}
                      </p>
                   </div>
                   <div className={`p-4 print:p-2 rounded-lg border ${isNoMatch(mapData.phen) ? 'border-rose-200 bg-rose-50/50' : 'border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/50'}`}>
                      <span className="block text-[10px] print:text-[7px] font-bold text-blue-500 uppercase tracking-widest mb-1">Floripa Números</span>
                      <p className={`font-medium text-sm print:text-[9.5px] print:leading-tight leading-snug ${isNoMatch(mapData.phen) ? 'text-rose-500 italic' : 'text-gray-700 dark:text-gray-300'}`}>{mapData.phen}</p>
                   </div>
                   <div className={`p-4 print:p-2 rounded-lg border ${isNoMatch(mapData.clp) ? 'border-rose-200 bg-rose-50/50' : 'border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/50'}`}>
                      <span className="block text-[10px] print:text-[7px] font-bold text-yellow-600 uppercase tracking-widest mb-1">Ranking CLP</span>
                      <p className={`font-medium text-sm print:text-[9.5px] print:leading-tight leading-snug ${isNoMatch(mapData.clp) ? 'text-rose-500 italic' : 'text-gray-700 dark:text-gray-300'}`}>{mapData.clp}</p>
                   </div>
                   <div className={`p-4 print:p-2 rounded-lg border ${isNoMatch(mapData.csc) ? 'border-rose-200 bg-rose-50/50' : 'border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/50'}`}>
                      <span className="block text-[10px] print:text-[7px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Smart Cities (CSC)</span>
                      <p className={`font-medium text-sm print:text-[9.5px] print:leading-tight leading-snug ${isNoMatch(mapData.csc) ? 'text-rose-500 italic' : 'text-gray-700 dark:text-gray-300'}`}>{mapData.csc}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  // --- REPORT VIEW RENDER ---
  if (reportView) {
    if (reportType === 'PURE_TABLE') {
       return (
         <div className="bg-white min-h-screen z-50 p-8 md:p-14 max-w-7xl w-full mx-auto print:p-0 print:m-0 font-sans">
            <div className="flex justify-between items-center print:hidden mb-8 border-b pb-4 sticky top-0 bg-white/90 backdrop-blur z-50 pt-4">
              <button onClick={() => setReportView(false)} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition font-medium border border-gray-200 px-4 py-2 rounded shadow-sm bg-white">
                 <X size={20} /> Voltar Daskboard
              </button>
              <button onClick={handlePrint} className="bg-podemos-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded flex items-center gap-2 transition font-bold uppercase tracking-wider text-sm shadow-xl">
                 <Printer size={16} /> Imprimir Matriz
              </button>
            </div>

            <header className="mb-8 text-center break-inside-avoid">
               <h1 className="text-3xl font-black mb-1 text-gray-900 uppercase">Tabela de Correlação Comparativa Pura</h1>
               <h2 className="text-sm font-bold text-gray-500 uppercase">Metas vs Floripa Números vs Institutos (CLP/CSC)</h2>
            </header>

            <div className="space-y-10">
              {comparisonAxes.filter(axis => selectedAxes.includes(axis.id)).map((axis, index) => (
                <div key={axis.id} className={`${index !== 0 ? 'break-before-page pt-8' : ''}`}>
                   <h2 className="text-2xl font-black uppercase text-gray-900 mb-2">{axis.title}</h2>
                   <ExactMappingTable explicitMap={axis.explicitMap} isPureTabletMode={true} />
                </div>
              ))}
            </div>
         </div>
       );
    }

    return (
      <div className="bg-white min-h-screen z-50 p-8 md:p-14 max-w-[1400px] w-full mx-auto print:p-0 print:m-0 font-sans">
        {/* ... (Executive Charts unchanged) ... */}
        <div className="flex justify-between items-center print:hidden mb-8 border-b pb-4 sticky top-0 bg-white/90 backdrop-blur z-50 pt-4">
          <button onClick={() => setReportView(false)} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 px-4 py-2 border rounded shadow-sm bg-white">
            <X size={20} /> Voltar Daskboard
          </button>
          <button onClick={handlePrint} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded flex items-center gap-2 font-bold uppercase text-sm shadow-xl">
            <Printer size={16} /> Emitir Relatório Completo PDF
          </button>
        </div>
        
        <header className="mb-10 pb-8 text-center border-b-[6px] border-gray-900">
          <h1 className="text-4xl font-extrabold mb-3 text-gray-900 tracking-tighter uppercase mt-4">Relação Explícita de Metas vs Indicadores Nacionais</h1>
          <h2 className="text-xl font-bold text-blue-800 mb-6 uppercase tracking-widest">Painel Fechamento de Exercício (ref. 2025)</h2>
        </header>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border-2 border-gray-200 bg-white p-5 flex flex-col justify-between break-inside-avoid">
             <h4 className="font-bold text-gray-900 mb-2 border-b pb-2 text-sm uppercase">Taxa de Execução PMF</h4>
             <div className="h-56 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={executionDataMock} margin={{ top: 10, right: 10, left: -20, bottom: 25 }} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} angle={-45} textAnchor="end" />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                    <Bar dataKey="executado" name="% Realizado" radius={[4, 4, 0, 0]}>
                      {executionDataMock.map((entry: any, index: number) => <Cell key={index} fill={entry.executado >= 90 ? '#10B981' : entry.executado >= 75 ? '#F59E0B' : '#EF4444'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="border-2 border-gray-200 bg-white p-5 flex flex-col justify-between break-inside-avoid">
             <h4 className="font-bold text-gray-900 mb-2 border-b pb-2 text-sm uppercase">Série Rankings Nacional</h4>
             <div className="h-56 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalRankingsMock} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                    <YAxis reversed domain={[1, 10]} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} tickCount={5} />
                    <Line type="monotone" dataKey="clp" name="CLP" stroke="#EAB308" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="csc" name="CSC" stroke="#10B981" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="border-2 border-gray-200 bg-white p-5 lg:col-span-1 md:col-span-2 flex flex-col justify-between break-inside-avoid">
             <h4 className="font-bold text-gray-900 mb-2 border-b pb-2 text-sm uppercase">Teia de Performance Geral</h4>
             <div className="h-56 mt-auto flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarDataMock}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 10, fontWeight: 600 }} />
                    <Radar name="Floripa" dataKey="floripa" stroke="#10B981" strokeWidth={2} fill="#10B981" fillOpacity={0.4} />
                    <Radar name="Brasil" dataKey="media" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </section>

        <section className="space-y-12">
          {comparisonAxes.filter(axis => selectedAxes.includes(axis.id)).map((axis, index) => (
            <div key={axis.id} className={`${index !== 0 ? 'break-before-page pt-8' : ''}`}>
               <div className="bg-gray-100/50 px-6 py-4 flex items-center gap-3 border-b-2 border-gray-400 print:bg-transparent print:border-b-4 print:border-gray-900 print:mb-2 text-gray-900">
                 <span className="p-2 bg-white rounded shadow-sm text-gray-800 print:hidden">{axis.icon}</span> 
                 <h3 className="text-2xl print:text-xl font-black text-gray-900 uppercase tracking-tighter">{axis.title}</h3>
               </div>
               <div className="pb-12 pt-4 print:pt-2 print:pb-6">
                 <h4 className="font-bold text-sm print:text-xs uppercase text-gray-500 mb-3 print:mb-1 tracking-widest border-b pb-2 print:pb-1">Despacho Institucional (Análise)</h4>
                 <p className="text-gray-900 text-justify text-[16px] print:text-[12px] print:leading-snug font-medium bg-gray-50/50 p-4 print:p-2 border border-gray-200 print:border-none rounded mb-8 print:mb-4 break-inside-avoid">{axis.neutralAnalysis}</p>
                 {/* RESTORED SUMMARIES IN THE REPORT */}
                 <div className="break-inside-avoid print:hidden">
                   {restoredFourColumnSummary(axis)}
                 </div>
                 {/* USE PURE TABLE FOR THE PDF EXPORT - OPTIMIZED WITH TABLE-FIXED SO IT NEVER DEFORMS */}
                 <ExactMappingTable explicitMap={axis.explicitMap} isPureTabletMode={true} />
               </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  // --- HTML DASHBOARD RENDER ---
  return (
    <div className="p-6 max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between bg-gray-50 flex items-center">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-white uppercase"><FileText className="text-blue-600" size={28} /> Emissão Relatórios</h2>
              </div>
              <button onClick={() => setIsReportModalOpen(false)}><X size={28} className="text-gray-400"/></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold mb-3 uppercase tracking-widest text-xs">Selecionar Eixos:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {comparisonAxes.map(axis => (
                  <button key={axis.id} onClick={() => toggleAxisSelection(axis.id)} className={`p-3 rounded-xl border-2 transition-all ${selectedAxes.includes(axis.id) ? 'border-gray-900 bg-gray-900 text-white' : 'bg-white text-gray-500 hover:border-gray-300'}`}>
                    <span className="text-[10px] font-black uppercase text-center">{axis.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex flex-col md:flex-row justify-end gap-3">
              <button className="px-5 py-3 rounded text-sm uppercase font-bold text-gray-500 hover:text-gray-900 mb-3 md:mb-0" onClick={() => setIsReportModalOpen(false)}>Cancelar</button>
              <button className="px-4 py-3 rounded font-black bg-blue-600 hover:bg-blue-700 text-white uppercase text-[11px] shadow-sm flex items-center gap-2 justify-center" onClick={() => handleGenerateReport('PURE_TABLE')} disabled={selectedAxes.length===0}><TableIcon size={16}/> Emitir Somente Matriz Em Tabela</button>
              <button className="px-4 py-3 rounded font-black bg-gray-900 hover:bg-black text-white uppercase text-[11px] shadow-sm flex items-center gap-2 justify-center" onClick={() => handleGenerateReport('MEMO_GERENCIAL')} disabled={selectedAxes.length===0}>Emitir Memo Executivo Completo</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 p-8 rounded-2xl shadow-xl text-white">
        <div className="pr-4">
          <span className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest mb-4 inline-block shadow-sm">Portal Executivo Avaliativo</span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter flex items-center gap-3 mt-1">Matriz Institucional Integrada</h1>
          <p className="text-gray-400 mt-3 max-w-4xl text-sm leading-relaxed">Painel cruzando 100% das métricas. Inclui listas gerais (CLP, Smart Cities) e uma Matriz Direta 1-para-1 evidenciando Hiatos/Gaps governamentais.</p>
        </div>
        <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-4 rounded font-black uppercase tracking-widest whitespace-nowrap"><Printer size={20} /> Protocolar Documentos</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpisMock.map((kpi: any, idx: number) => (
          <div key={idx} className={`p-6 rounded-2xl border ${kpi.color} shadow-sm relative overflow-hidden bg-white dark:bg-gray-800`}>
             <div className="mb-4">{kpi.icon}</div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{kpi.value}</h3>
             <p className="font-bold text-gray-800 text-sm">{kpi.title}</p>
             <p className="text-[10px] text-gray-500 mt-1.5 font-bold uppercase tracking-wider">{kpi.description}</p>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border-2 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
           <h4 className="font-bold text-gray-900 dark:text-white mb-2 border-b dark:border-gray-700 pb-2 text-sm uppercase">Taxa de Execução PMF</h4>
           <div className="h-56 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={executionDataMock} margin={{ top: 10, right: 10, left: -20, bottom: 25 }} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} angle={-45} textAnchor="end" />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                  <Bar dataKey="executado" name="% Realizado" radius={[4, 4, 0, 0]}>
                    {executionDataMock.map((entry: any, index: number) => <Cell key={index} fill={entry.executado >= 90 ? '#10B981' : entry.executado >= 75 ? '#F59E0B' : '#EF4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="border-2 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
           <h4 className="font-bold text-gray-900 dark:text-white mb-2 border-b dark:border-gray-700 pb-2 text-sm uppercase">Série Rankings Nacional</h4>
           <div className="h-56 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalRankingsMock} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                  <YAxis reversed domain={[1, 10]} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} tickCount={5} />
                  <Line type="monotone" dataKey="clp" name="CLP" stroke="#EAB308" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="csc" name="CSC" stroke="#10B981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="border-2 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-5 rounded-2xl shadow-sm lg:col-span-1 md:col-span-2 flex flex-col justify-between">
           <h4 className="font-bold text-gray-900 dark:text-white mb-2 border-b dark:border-gray-700 pb-2 text-sm uppercase">Teia de Performance Geral</h4>
           <div className="h-56 mt-auto flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarDataMock}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 10, fontWeight: 600 }} />
                  <Radar name="Floripa" dataKey="floripa" stroke="#10B981" strokeWidth={2} fill="#10B981" fillOpacity={0.4} />
                  <Radar name="Brasil" dataKey="media" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-10">
        <div className="flex flex-col xl:flex-row">
          <div className="xl:w-[320px] bg-white p-6 border-r border-gray-200 shadow-sm shrink-0">
            <span className="block text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Seleção de Pasta</span>
            <nav className="flex flex-row xl:flex-col gap-3 overflow-x-auto pb-4 xl:pb-0 scrollbar-thin scrollbar-thumb-gray-200">
              {comparisonAxes.map(axis => (
                <button key={axis.id} onClick={() => setActiveTab(axis.id)} className={`flex items-center justify-between px-5 py-4 rounded-xl text-sm transition-all border-2 ${activeTab === axis.id ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3"><span className={`${activeTab === axis.id ? 'text-white' : 'text-gray-400'}`}>{axis.icon}</span><span className="font-black uppercase tracking-wider text-xs">{axis.title}</span></div>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-6 xl:p-10 bg-gray-50/50 w-full overflow-hidden">
            {activeAxisData && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-300 w-full overflow-hidden">
                {/* RESTORED LISTS */}
                {restoredFourColumnSummary(activeAxisData)}
                {/* 1:1 TABULAR COMPARISON */}
                <ExactMappingTable explicitMap={activeAxisData.explicitMap} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
