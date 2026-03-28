"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCampaign, INTERACTION_WEIGHTS } from "@/store/CampaignStore";
import { Search, User, MapPin, Phone, Mail, Activity, UploadCloud, ChevronDown, Award } from "lucide-react";

function MultiSelectDropdown({ 
  title, 
  options, 
  selectedValues, 
  onChange 
}: { 
  title: string, 
  options: {label: string, value: string}[], 
  selectedValues: string[], 
  onChange: (vals: string[]) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const isAllSelected = selectedValues.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs p-2 flex justify-between items-center cursor-pointer hover:border-podemos-blue dark:hover:border-blue-400 transition-colors"
      >
        <span className="truncate flex-1 text-left text-gray-700 dark:text-gray-300">
          {isAllSelected ? title : `${title} (${selectedValues.length})`}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-xs border-b border-gray-100 dark:border-gray-700">
            <input 
              type="checkbox" 
              checked={isAllSelected}
              onChange={() => onChange([])}
              className="rounded border-gray-300 text-podemos-blue focus:ring-podemos-blue"
            />
            <span className="truncate font-semibold text-gray-700 dark:text-gray-200">Todos</span>
          </label>
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-xs">
              <input 
                type="checkbox" 
                checked={selectedValues.includes(opt.value)}
                onChange={() => toggleSelection(opt.value)}
                className="rounded border-gray-300 text-podemos-blue focus:ring-podemos-blue"
              />
              <span className="truncate text-gray-600 dark:text-gray-400">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EleitoresPage() {
  const { data, filteredData, isLoaded, addTag, removeTag, addInteraction, updateVoter, selectedVoterId, setSelectedVoterId } = useCampaign();
  const [selectedEleitor, setSelectedEleitor] = useState<any | null>(null);
  
  // Auto-select voter logic if coming from external list
  useEffect(() => {
    if (selectedVoterId && data.length > 0) {
      const targetVoter = data.find(v => v.id === selectedVoterId);
      if (targetVoter) {
        setSelectedEleitor(targetVoter);
      }
      setSelectedVoterId(null);
    }
  }, [selectedVoterId, data, setSelectedVoterId]);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedEleitor) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updated = { ...selectedEleitor, foto: base64String };
        updateVoter(updated);
        setSelectedEleitor(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    setEditForm({ ...selectedEleitor });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateVoter(editForm);
    setSelectedEleitor(editForm);
    setIsEditing(false);
  };

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
  
  // Tag States
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Liderança States
  const [isAddingLideranca, setIsAddingLideranca] = useState(false);
  const [newLideranca, setNewLideranca] = useState("");

  // History States
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [newHistoryType, setNewHistoryType] = useState("Ligação");
  const [newHistoryNote, setNewHistoryNote] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && selectedEleitor) {
      addTag(selectedEleitor.id, newTag);
      // Update local state to reflect immediately
      setSelectedEleitor({ ...selectedEleitor, tags: [...(selectedEleitor.tags || []), newTag.trim()] });
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleAddLideranca = () => {
    if (newLideranca.trim() && selectedEleitor) {
      const updatedLiderancas = [...(selectedEleitor.liderancas || []), newLideranca.trim()];
      const updatedVoter = { ...selectedEleitor, liderancas: updatedLiderancas };
      updateVoter(updatedVoter);
      setSelectedEleitor(updatedVoter);
      setNewLideranca("");
      setIsAddingLideranca(false);
    }
  };

  const removeLideranca = (voterId: string, liderancaToRemove: string) => {
    if (selectedEleitor && selectedEleitor.id === voterId) {
       const updatedLiderancas = (selectedEleitor.liderancas || []).filter((l: string) => l !== liderancaToRemove);
       const updatedVoter = { ...selectedEleitor, liderancas: updatedLiderancas };
       updateVoter(updatedVoter);
       setSelectedEleitor(updatedVoter);
    }
  };

  const handleAddHistory = () => {
    if (newHistoryNote.trim() && selectedEleitor) {
      const interaction = {
        data: new Date().toISOString(),
        tipo: newHistoryType,
        observacao: newHistoryNote.trim()
      };
      addInteraction(selectedEleitor.id, interaction);
      // Update local state to reflect immediately
      setSelectedEleitor({ 
        ...selectedEleitor, 
        historico: [interaction, ...(selectedEleitor.historico || [])] 
      });
      setNewHistoryNote("");
      setIsAddingHistory(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Base de Dados Vazia</h2>
        <p className="text-gray-500">Por favor, importe um arquivo CSV na Visão Geral primeiro.</p>
      </div>
    );
  }

  // Filter States (now read directly from the global store)
  const { filters, setFilter, clearFilters } = useCampaign();

  // Derive unique values for the filter dropdowns
  const uniqueCities = Array.from(new Set(data.map(d => d.cidade).filter(Boolean))).sort();
  const uniqueTags = Array.from(new Set(data.flatMap(d => d.tags || []).filter(Boolean))).sort();
  const uniqueLeaders = Array.from(new Set(data.flatMap(d => d.liderancas || []).filter(Boolean))).sort();

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Base de Eleitores</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerencie e visualize detalhes de cada apoiador da campanha.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista Lateral */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[700px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-xl">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                value={filters.globalSearch || ""}
                onChange={(e) => setFilter("globalSearch", e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-podemos-green/50 focus:border-podemos-green transition-all placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
               <select 
                 className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs p-2 text-gray-700 dark:text-gray-200 outline-none focus:border-podemos-blue"
                 value={filters.cidade || ""}
                 onChange={(e) => setFilter('cidade', e.target.value !== "" ? e.target.value : undefined)}
               >
                 <option value="">Todas as Cidades</option>
                 {uniqueCities.map((c: string) => <option key={c} value={c}>{c}</option>)}
               </select>

               <select 
                 className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs p-2 text-gray-700 dark:text-gray-200 outline-none focus:border-podemos-blue"
                 value={filters.engajamento || ""}
                 onChange={(e) => setFilter('engajamento', e.target.value !== "" ? parseInt(e.target.value) : undefined)}
               >
                 <option value="">Todos Engajamentos</option>
                 <option value="5">Nível 5 (Forte)</option>
                 <option value="4">Nível 4</option>
                 <option value="3">Nível 3</option>
                 <option value="2">Nível 2</option>
                 <option value="1">Nível 1 (Frio)</option>
               </select>
               
               <select 
                 className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs p-2 text-gray-700 dark:text-gray-200 outline-none focus:border-podemos-blue"
                 value={filters.posicao || ""}
                 onChange={(e) => setFilter('posicao', e.target.value !== "" ? parseInt(e.target.value) : undefined)}
               >
                 <option value="">Todas as Posições</option>
                 <option value="5">5 - Liderança Máxima</option>
                 <option value="4">4 - Líder de Bairro</option>
                 <option value="3">3 - Multiplicador</option>
                 <option value="2">2 - Apoiador Ativo</option>
                 <option value="1">1 - Eleitor Comum</option>
               </select>
            </div>
            
             <div className="mb-2">
               <select 
                 className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs p-2 text-gray-700 dark:text-gray-200 outline-none focus:border-podemos-blue"
                 value={filters.lideranca || ""}
                 onChange={(e) => setFilter('lideranca', e.target.value !== "" ? e.target.value : undefined)}
               >
                 <option value="">Todas as Lideranças</option>
                 {uniqueLeaders.map((l: string) => <option key={l} value={l}>{l}</option>)}
               </select>
            </div>

            <div className="mb-2">
               <select 
                 className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs p-2 text-gray-700 dark:text-gray-200 outline-none focus:border-podemos-blue"
                 value={filters.tag || ""}
                 onChange={(e) => setFilter('tag', e.target.value !== "" ? e.target.value : undefined)}
               >
                 <option value="">Todas as Tags</option>
                 {uniqueTags.map((t: string) => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-xs text-gray-500 font-medium">Mostrando {filteredData.length} resultados</p>
              
              {(activeFiltersCount > 0) && (
                <button 
                  onClick={clearFilters}
                  className="text-xs text-podemos-blue hover:text-blue-800 font-bold transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredData.map((eleitor, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEleitor(eleitor)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors flex items-center gap-3 ${
                  selectedEleitor === eleitor ? 'bg-podemos-blue/10 dark:bg-blue-900/30 border border-podemos-blue/20 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0 overflow-hidden">
                  {eleitor.foto ? (
                    <img src={eleitor.foto} alt={eleitor.nome} className="w-full h-full object-cover" />
                  ) : (
                    eleitor.nome.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="truncate">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{eleitor.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{eleitor.cidade} - {eleitor.bairro}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes do Eleitor */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-[700px] overflow-y-auto">
          {selectedEleitor ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Header do Perfil */}
              <div className="flex flex-col md:flex-row gap-6 items-start border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
                
              {/* Perfil Principal */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Cabeçalho do Perfil */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-2 h-full ${getEngagementColor(selectedEleitor?.engajamento || 3).split(' ')[0]}`} />
            
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center rounded-full border-4 border-white dark:border-gray-800 shadow-sm relative shrink-0 group cursor-pointer overflow-hidden hover:border-podemos-blue dark:hover:border-blue-400 transition-colors text-center">
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handlePhotoUpload} 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               {selectedEleitor?.foto ? (
                 <img src={selectedEleitor.foto} alt={selectedEleitor.nome} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
               ) : (
                 <User className="text-gray-400 dark:text-gray-500 group-hover:opacity-0 transition-opacity" size={40} />
               )}
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-opacity pointer-events-none">
                 <UploadCloud size={20} className="mb-1" />
                 <span className="text-[9px] font-bold uppercase tracking-wider">Foto</span>
               </div>
               
               <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center z-20 ${getEngagementColor(selectedEleitor?.engajamento || 3).split(' ')[0]}`}>
                 <Activity size={10} className="text-white" />
               </div>
            </div>

            <div className="flex-1 text-center md:text-left">
               {isEditing ? (
                 <div className="space-y-3">
                   <input type="text" value={editForm.nome || ""} onChange={e => setEditForm({...editForm, nome: e.target.value})} className="w-full text-xl font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 focus:outline-none focus:border-podemos-blue" placeholder="Nome Completo"/>
                   <div className="flex flex-col gap-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Posição Política (Força)</label>
                     <select value={editForm.posicao || 1} onChange={e => setEditForm({...editForm, posicao: parseInt(e.target.value)})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-podemos-blue">
                        <option value={1}>1 - Eleitor Comum / Frio</option>
                        <option value={2}>2 - Apoiador Ativo</option>
                        <option value={3}>3 - Multiplicador</option>
                        <option value={4}>4 - Líder de Bairro</option>
                        <option value={5}>5 - Liderança Máxima / Coordenador</option>
                     </select>
                   </div>
                 </div>
               ) : (
                 <>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center md:justify-start gap-2">
                     {selectedEleitor.nome}
                     {selectedEleitor.voterScore > 0 && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-700/50" title="CRM Score">
                          <Award size={12} />
                          {selectedEleitor.voterScore} pontos
                        </span>
                     )}
                   </h2>
                   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                     <span className="flex items-center gap-1"><MapPin size={14} className="text-podemos-green" /> {selectedEleitor.cidade} - {selectedEleitor.bairro}</span>
                     {selectedEleitor.telefone && <span className="flex items-center gap-1"><Phone size={14} className="text-podemos-blue" /> {selectedEleitor.telefone}</span>}
                     {selectedEleitor.email && <span className="flex items-center gap-1"><Mail size={14} className="text-podemos-blue" /> {selectedEleitor.email}</span>}
                     <span className="flex items-center gap-1 font-semibold text-podemos-blue bg-blue-50 dark:bg-blue-900/20 px-2 rounded-full">Força: Nível {selectedEleitor.posicao || 1}</span>
                   </div>
                 </>
               )}
            </div>
                    
                    <div className="flex items-center gap-2">
                       {isEditing ? (
                         <div className="flex items-center gap-1">
                           <button onClick={handleSaveEdit} className="text-xs font-bold text-white bg-podemos-blue px-3 py-1.5 rounded hover:bg-blue-700 transition">Salvar</button>
                           <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancelar</button>
                         </div>
                       ) : (
                         <button onClick={handleStartEdit} className="text-xs font-bold text-podemos-blue dark:text-blue-400 border border-podemos-blue dark:border-blue-400 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                           Editar Perfil
                         </button>
                       )}
                    </div>
                  </div>
                  
                  <div className="mt-2 mb-4 flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
                      {isEditing ? (
                         <select 
                           value={editForm.engajamento || 3}
                           onChange={(e) => setEditForm({...editForm, engajamento: parseInt(e.target.value)})}
                           className="text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded p-1 focus:outline-none focus:border-podemos-blue"
                         >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>Nível {n}</option>)}
                         </select>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-podemos-green dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-100 dark:border-green-900/50">
                          <Activity size={14} /> Engajamento: Nível {selectedEleitor.engajamento}
                        </div>
                      )}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                      {isEditing ? (
                        <div className="flex gap-1">
                          <input type="text" value={editForm.cidade || ""} onChange={e => setEditForm({...editForm, cidade: e.target.value})} placeholder="Cidade" className="w-1/2 bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-podemos-blue py-0.5 text-xs"/>
                          <input type="text" value={editForm.bairro || ""} onChange={e => setEditForm({...editForm, bairro: e.target.value})} placeholder="Bairro" className="w-1/2 bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-podemos-blue py-0.5 text-xs"/>
                        </div>
                      ) : (
                        <span className="truncate">{selectedEleitor.cidade} - {selectedEleitor.bairro}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      {isEditing ? (
                         <input type="text" value={editForm.telefone || ""} onChange={e => setEditForm({...editForm, telefone: e.target.value})} placeholder="(00) 00000-0000" className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-podemos-blue py-0.5 text-xs"/>
                      ) : (
                         <span className="truncate">{selectedEleitor.telefone || "Não informado"}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 md:col-span-2">
                      <Mail size={16} className="text-gray-400 flex-shrink-0" />
                      {isEditing ? (
                         <input type="email" value={editForm.email || ""} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="email@exemplo.com" className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-podemos-blue py-0.5 text-xs"/>
                      ) : (
                         <span className="truncate">{selectedEleitor.email || "Não informado"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Corpo do Perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider">Dados Demográficos</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Idade</p>
                      {isEditing ? (
                         <input type="number" value={editForm.idade || ""} onChange={e => setEditForm({...editForm, idade: parseInt(e.target.value)})} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:outline-none focus:border-podemos-blue" placeholder="Ex: 35"/>
                      ) : (
                         <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedEleitor.idade ? `${selectedEleitor.idade} anos` : "Não informada"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Gênero</p>
                      {isEditing ? (
                         <select value={editForm.genero || ""} onChange={e => setEditForm({...editForm, genero: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:outline-none focus:border-podemos-blue">
                           <option value="">Não informado</option>
                           <option value="Masculino">Masculino</option>
                           <option value="Feminino">Feminino</option>
                           <option value="Outro">Outro</option>
                         </select>
                      ) : (
                         <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedEleitor.genero || "Não informado"}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100/50 dark:border-blue-900/50">
                  <h3 className="font-bold text-podemos-blue dark:text-blue-400 mb-3 text-sm uppercase tracking-wider">Lideranças Políticas</h3>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Responsáveis pela captação</p>
                    {isEditing ? (
                        <div className="flex flex-wrap gap-2 items-center mt-2">
                          {editForm.liderancas && editForm.liderancas.length > 0 ? (
                            editForm.liderancas.map((lider: string, idx: number) => (
                              <span key={idx} className="bg-podemos-blue dark:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 group">
                                {lider}
                                <button
                                  onClick={() => setEditForm({...editForm, liderancas: editForm.liderancas?.filter((l: string) => l !== lider)})}
                                  className="w-3 h-3 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/50 text-transparent group-hover:text-white transition-all ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500 italic mr-2">Nenhuma liderança vinculada.</span>
                          )}
                          
                          {isAddingLideranca ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                value={newLideranca}
                                onChange={(e) => setNewLideranca(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                     setEditForm({...editForm, liderancas: [...(editForm.liderancas || []), newLideranca.trim()]});
                                     setNewLideranca("");
                                     setIsAddingLideranca(false);
                                  }
                                  if (e.key === 'Escape') setIsAddingLideranca(false);
                                }}
                                placeholder="Nome do líder..."
                                className="text-xs px-2 py-1 bg-transparent text-gray-900 dark:text-gray-100 border border-podemos-blue rounded w-28 focus:outline-none"
                                autoFocus
                              />
                              <button onClick={() => {
                                  setEditForm({...editForm, liderancas: [...(editForm.liderancas || []), newLideranca.trim()]});
                                  setNewLideranca("");
                                  setIsAddingLideranca(false);
                                }} className="text-xs font-bold text-podemos-green p-1">Ok</button>
                              <button onClick={() => setIsAddingLideranca(false)} className="text-xs font-bold text-gray-400 p-1">X</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setIsAddingLideranca(true)}
                              className="text-xs font-semibold px-3 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-podemos-blue hover:text-podemos-blue transition-colors"
                            >
                              + Adicionar Liderança
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 items-center mt-2">
                          {selectedEleitor.liderancas && selectedEleitor.liderancas.length > 0 ? (
                            selectedEleitor.liderancas.map((lider: string, idx: number) => (
                              <span key={idx} className="bg-podemos-blue dark:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 group">
                                {lider}
                                <button 
                                  onClick={() => removeLideranca(selectedEleitor.id, lider)}
                                  className="w-3 h-3 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/50 text-transparent group-hover:text-white transition-all ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Voluntário / Orgânico</p>
                          )}
                          
                          {isAddingLideranca ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                value={newLideranca}
                                onChange={(e) => setNewLideranca(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddLideranca();
                                  if (e.key === 'Escape') setIsAddingLideranca(false);
                                }}
                                placeholder="Nome do líder..."
                                className="text-xs px-2 py-1 bg-transparent text-gray-900 dark:text-gray-100 border border-podemos-blue rounded w-28 focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleAddLideranca} className="text-xs font-bold text-podemos-green p-1">Ok</button>
                              <button onClick={() => setIsAddingLideranca(false)} className="text-xs font-bold text-gray-400 p-1">X</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setIsAddingLideranca(true)}
                              className="text-xs font-semibold px-3 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-podemos-blue hover:text-podemos-blue transition-colors"
                            >
                              + Adicionar Liderança
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider">Tags & Segmentação</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedEleitor.tags && selectedEleitor.tags.length > 0 ? (
                    selectedEleitor.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-podemos-blue text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 group">
                        {tag}
                        <button 
                          onClick={() => removeTag(selectedEleitor.id, tag)}
                          className="w-3 h-3 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/50 text-transparent group-hover:text-white transition-all ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500 italic mr-2">Nenhuma tag atribuída.</span>
                  )}
                  
                  {isAddingTag ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTag();
                          if (e.key === 'Escape') setIsAddingTag(false);
                        }}
                        placeholder="Nome da tag..."
                        className="text-xs px-2 py-1 bg-transparent text-gray-900 dark:text-gray-100 border border-podemos-blue rounded w-28 focus:outline-none"
                        autoFocus
                      />
                      <button onClick={handleAddTag} className="text-xs font-bold text-podemos-green p-1">Ok</button>
                      <button onClick={() => setIsAddingTag(false)} className="text-xs font-bold text-gray-400 p-1">X</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAddingTag(true)}
                      className="text-xs font-semibold px-3 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-podemos-blue hover:text-podemos-blue transition-colors"
                    >
                      + Adicionar Tag
                    </button>
                  )}
                </div>
              </div>

              {/* Histórico de Interações */}
              <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm uppercase tracking-wider">Histórico de Contatos</h3>
                  <button 
                    onClick={() => setIsAddingHistory(!isAddingHistory)}
                    className="bg-podemos-green text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                  >
                    {isAddingHistory ? "Cancelar" : "+ Registrar Contato"}
                  </button>
                </div>
                
                {isAddingHistory && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4 animate-in fade-in">
                    <div className="flex gap-2 mb-2">
                       <select 
                        value={newHistoryType} 
                        onChange={(e) => setNewHistoryType(e.target.value)}
                        className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded p-1.5 focus:outline-none focus:border-podemos-blue"
                       >
                         <option value="Outro">Outro</option>
                       </select>
                    </div>
                    <textarea 
                      value={newHistoryNote}
                      onChange={(e) => setNewHistoryNote(e.target.value)}
                      placeholder="Observações do contato..."
                      className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded p-2 min-h-[60px] focus:outline-none focus:border-podemos-blue mb-2"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleAddHistory}
                        disabled={!newHistoryNote.trim()}
                        className="bg-podemos-blue text-white text-xs font-bold px-3 py-1.5 rounded disabled:opacity-50 transition-colors"
                      >
                        Salvar Registro
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {selectedEleitor.historico && selectedEleitor.historico.length > 0 ? (
                    selectedEleitor.historico.map((hist: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 border text-sm border-gray-100 dark:border-gray-700 p-3 rounded-lg shadow-sm border-l-4 border-l-podemos-blue">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-800 dark:text-gray-100">{hist.tipo}</span>
                          <span className="text-xs text-gray-400">{new Date(hist.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{hist.observacao}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum contato registrado com este eleitor.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                <User size={32} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Selecione um Eleitor</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Clique em um nome na lista ao lado para visualizar o perfil completo e inserir a foto.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
