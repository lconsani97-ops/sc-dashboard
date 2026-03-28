"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Papa from "papaparse";

export type Interacao = {
  data: string;
  tipo: string;
  observacao: string;
};

export const INTERACTION_WEIGHTS: Record<string, number> = {
  "Visita Presencial": 50,
  "Reunião": 30,
  "Mensagem Direta": 20,
  "Ligação": 10,
  "WhatsApp": 5,
  "E-mail": 2,
  "Outro": 1
};

export type DashboardFilters = {
  engajamento?: number;
  posicao?: number;
  cidade?: string;
  bairro?: string;
  tag?: string;
  lideranca?: string;
  globalSearch?: string;
};

export type VoterData = {
  id: string; // Adicionado ID único para edição
  nome: string;
  cidade: string;
  bairro: string;
  engajamento: number; // 1-5 (Termômetro)
  posicao: number; // 1-5 (Força Política)
  voterScore: number; // CRM Score calculado
  liderancas: string[];
  telefone?: string;
  idade?: number;
  genero?: string;
  email?: string;
  foto?: string;
  tags: string[];
  historico: Interacao[];
  [key: string]: any;
};

interface CampaignState {
  data: VoterData[];
  filteredData: VoterData[];
  filters: DashboardFilters;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  selectedVoterId: string | null;
  setSelectedVoterId: (id: string | null) => void;
  loadData: (file: File) => Promise<void>;
  resetData: () => void;
  updateVoter: (updatedVoter: VoterData) => void;
  addInteraction: (voterId: string, interacao: Interacao) => void;
  addTag: (voterId: string, tag: string) => void;
  removeTag: (voterId: string, tag: string) => void;
  setFilter: (key: keyof DashboardFilters, value: any) => void;
  clearFilters: () => void;
}

const CampaignContext = createContext<CampaignState | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<VoterData[]>([]);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);

  const loadData = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    return new Promise<void>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            // Validate and transform data as needed
            const parsedData: VoterData[] = results.data.map((row: any, index: number) => {
              // Map varying column names to standard internal fields
              const cidadeVar = row.Cidade || row.cidade || row.Município || row.municipio || "";
              const bairroVar = row.Bairro || row.bairro || "";
              const nomeVar = row.Nome || row.nome || row.Eleitor || "";
              const engajamentoVar = parseInt(row.Engajamento || row.engajamento || row.Termômetro || "3", 10);
              const liderancaVar = row["Liderança"] || row.Lideranca || row.lideranca || "";
              const idadeVar = parseInt(row.Idade || row.idade || "0", 10);
              const generoVar = row.Genero || row.genero || row.Gênero || "";
              const telefoneVar = row.Telefone || row.telefone || row.Celular || "";
              const emailVar = row.Email || row.email || "";
              
              const rawTags = row.Tags || row.tags || "";
              const tagsArray = rawTags ? String(rawTags).split(";").map(t => t.trim()).filter(Boolean) : [];

              return {
                ...row,
                id: `voter_${index}_${Date.now()}`,
                nome: String(nomeVar),
                cidade: String(cidadeVar).trim(),
                bairro: String(bairroVar).trim(),
                engajamento: isNaN(engajamentoVar) ? 3 : engajamentoVar,
                posicao: row.Posicao ? parseInt(row.Posicao, 10) : 1, // Default para Eleitor comum
                voterScore: 0, // Inicia zerado caso não haja histórico no CSV
                liderancas: liderancaVar ? String(liderancaVar).split(';').map(l => l.trim()).filter(Boolean) : [],
                idade: isNaN(idadeVar) ? undefined : idadeVar,
                genero: generoVar ? String(generoVar).trim() : undefined,
                telefone: telefoneVar ? String(telefoneVar).trim() : undefined,
                email: emailVar ? String(emailVar).trim() : undefined,
                tags: tagsArray,
                historico: [] // Inicializa vazio ao carregar do CSV base
              };
            });

            setData(parsedData);
            setIsLoaded(true);
            resolve();
          } catch (err) {
            setError("Erro ao processar as colunas do arquivo. Verifique o formato.");
            reject(err);
          } finally {
            setIsLoading(false);
          }
        },
        error: (error) => {
          setError(`Erro na leitura do arquivo: ${error.message}`);
          setIsLoading(false);
          reject(error);
        }
      });
    });
  };

  const resetData = () => {
    setData([]);
    setIsLoaded(false);
    setError(null);
  };
  
  const updateVoter = (updatedVoter: VoterData) => {
    setData(prev => prev.map(v => v.id === updatedVoter.id ? updatedVoter : v));
  };

  const addInteraction = (voterId: string, interacao: Interacao) => {
    setData((prev) =>
      prev.map((v) => {
        if (v.id === voterId) {
          const newHistory = [interacao, ...(v.historico || [])];
          // Recalculate score
          const newScore = newHistory.reduce((acc, curr) => acc + (INTERACTION_WEIGHTS[curr.tipo] || 1), 0);
          return { ...v, historico: newHistory, voterScore: newScore };
        }
        return v;
      })
    );
  };

  const addTag = (voterId: string, tag: string) => {
    const formattedTag = tag.trim();
    if (!formattedTag) return;
    
    setData(prev => prev.map(v => {
      if (v.id === voterId && !v.tags.includes(formattedTag)) {
        return { ...v, tags: [...(v.tags || []), formattedTag] };
      }
      return v;
    }));
  };

  const removeTag = (voterId: string, tagToRemove: string) => {
    setData(prev => prev.map(v => {
      if (v.id === voterId) {
        return { ...v, tags: (v.tags || []).filter(t => t !== tagToRemove) };
      }
      return v;
    }));
  };

  const setFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      // Se clicar no mesmo filtro que já está ativo, ele remove
      [key]: prev[key] === value ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const filteredData = React.useMemo(() => {
    return data.filter(voter => {
        if (filters.engajamento && voter.engajamento !== filters.engajamento) return false;
        if (filters.posicao && voter.posicao !== filters.posicao) return false;
        if (filters.cidade && voter.cidade !== filters.cidade) return false;
      if (filters.bairro !== undefined && voter.bairro !== filters.bairro) return false;
      if (filters.tag !== undefined && !voter.tags.includes(filters.tag)) return false;
      if (filters.lideranca !== undefined && !voter.liderancas.includes(filters.lideranca)) return false;
      
      if (filters.globalSearch) {
        const searchTerms = filters.globalSearch.split(';').map(t => t.trim().toLowerCase()).filter(Boolean);
        
        const matchesAllTerms = searchTerms.every(term => {
          const matchesNome = voter.nome.toLowerCase().includes(term);
          const matchesCidade = voter.cidade?.toLowerCase().includes(term);
          const matchesBairro = voter.bairro?.toLowerCase().includes(term);
          const matchesLideranca = !!voter.liderancas?.some(lid => lid.toLowerCase().includes(term));
          const matchesEngajamento = voter.engajamento?.toString() === term;
          const matchesTags = !!voter.tags?.some(tag => tag.toLowerCase().includes(term));
          const matchesTelefone = !!voter.telefone?.toLowerCase().includes(term);

          return matchesNome || matchesCidade || matchesBairro || matchesLideranca || matchesEngajamento || matchesTags || matchesTelefone;
        });

        if (!matchesAllTerms) return false;
      }

      return true;
    });
  }, [data, filters]);

  return (
    <CampaignContext.Provider value={{ 
        data, filteredData, filters, isLoaded, isLoading, error, 
        selectedVoterId, setSelectedVoterId,
        loadData, resetData, updateVoter, addInteraction, addTag, removeTag,
        setFilter, clearFilters
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
}
