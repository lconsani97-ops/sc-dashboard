import React from "react";
import { Heart, BookOpen, ShieldCheck, Briefcase, Leaf, Bus, Landmark } from "lucide-react";

export const NO_MATCH_TEXT = "Não há indicador semelhante";
export type StatusColor = 'green' | 'yellow' | 'red';

export type MetricMapping = {
  theme: string; 
  pmf: string; 
  phen: string; 
  clp: string; 
  csc: string; 
  isGap: boolean; 
};

export type AxisData = {
  id: string;
  title: string;
  icon: React.ReactNode;
  clp: string[];        // Restored lists
  smartCities: string[]; // Restored lists
  planoMetas: string[];  // Restored lists
  floripaNumeros: string[]; // Restored lists
  neutralAnalysis: string;
  executiveHighlights2025: string[];
  status: StatusColor;
  explicitMap: MetricMapping[];
};

export const comparisonAxes: AxisData[] = [
  {
    id: 'saude',
    title: 'Saúde',
    icon: <Heart size={18} />,
    status: 'yellow',
    clp: ['Acesso à Saúde', 'Cobertura Vacinal', 'Pré-natal', 'Mortalidade Infantil', 'Desnutrição'],
    smartCities: ['Leitos por habitante', 'Investimento per capita', 'Atenção básica', 'Mortalidade', 'Profissionais Saúde/Hab'],
    planoMetas: ['Reforma de Centros', 'Digitalização', 'Aumento Saúde Família', 'Exames Zera Fila', 'Policlínica Mulher'],
    floripaNumeros: ['Índice de Mortalidade', 'Óbitos infantis', 'Despesa Total', 'Consultas Básicas/Ano', 'Tempo Espera Exames'],
    neutralAnalysis: 'Apesar de manter altas notas na métrica de Mortalidade Infantil (CLP), os desafios persistem na proporção de leitos por habitante (CSC). O Plano de Metas atingiu alta execução focado em reformas pontuais e digitalização.',
    executiveHighlights2025: ['Alô Saúde 100% digitalizado', 'Entrega da Policlínica da Mulher', 'Ampliação Secundária'],
    explicitMap: [
      { theme: 'Telessaúde', pmf: 'Expansão Alô Saúde', phen: 'Atendimentos Virtuais', clp: 'Acesso Saúde Básica', csc: 'Atenção Básica', isGap: false },
      { theme: 'Proteção Criança', pmf: 'Policlínica Criança', phen: 'Óbitos infantis', clp: 'Mortalidade Infantil', csc: 'Mortes a cada 1000 nascidos', isGap: false },
      { theme: 'Macro-Hospitais', pmf: NO_MATCH_TEXT, phen: NO_MATCH_TEXT, clp: 'Mortalidade Causas Evitáveis', csc: 'Leitos por 1.000 Hab', isGap: true },
      { theme: 'Prevenção Básica', pmf: 'Equipes Saúde Família', phen: 'Cobertura ESF %', clp: 'Desnutrição/Pré-natal', csc: 'Gastos per capita Básica', isGap: false },
      { theme: 'Imunização', pmf: 'Campanha Zé Gotinha', phen: 'Índice de Cobertura Vacinal', clp: 'Cobertura Vacinal', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Efetivo Médico', pmf: 'Concurso Público SMS', phen: 'Médico por 100 mil hab', clp: NO_MATCH_TEXT, csc: 'Profissionais/Habitante', isGap: false },
      { theme: 'Redução de Filas', pmf: 'Mutirão Zera Fila', phen: 'Tempo Espera Cirurgia Eletiva', clp: 'Qualidade Atendimento', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Odontologia', pmf: 'Ampliação Odonto ESF', phen: 'Cobertura Saúde Bucal', clp: NO_MATCH_TEXT, csc: 'Atenção Odontológica Básica', isGap: false },
      { theme: 'Saúde Mental', pmf: 'Reforma CAPS', phen: 'Atendimentos Psiquiátricos', clp: 'Morbidade Evitável', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Farmácia Básica', pmf: 'Digitalização Dispensários', phen: 'Disponibilidade Relativa Med', clp: 'Acesso Saúde Básica', csc: NO_MATCH_TEXT, isGap: false }
    ]
  },
  {
    id: 'educacao',
    title: 'Educação',
    icon: <BookOpen size={18} />,
    status: 'red',
    clp: ['Taxa de Atendimento', 'Qualidade IDEB', 'Abandono escolar', 'Matrículas Médio', 'Proficiência'],
    smartCities: ['Vagas em creches', 'Matrículas rede', 'Computadores', 'Tempo Integral', 'Empregos Educação'],
    planoMetas: ['Ampliação de vagas creches', 'Novas escolas', 'Inclusão digital', 'Premiação IDEB', 'Capacitação'],
    floripaNumeros: ['Taxa de escolarização', 'IDEB Anual', 'Despesa Educação', 'Déficit Creches', 'Professores Efetivos'],
    neutralAnalysis: 'A cidade apresenta resultados excelentes no IDEB (CLP). Mas a "Taxa de Atendimento" por falta de vagas em creches amarga a meta.',
    executiveHighlights2025: ['Manutenção 1º Lugar IDEB', 'Tablets p/ Rede Básica (1/aluno)', '2.000 Vagas em Creche (Atraso)'],
    explicitMap: [
      { theme: 'Acesso Digital', pmf: 'Distribuição Tablets', phen: 'Alunos com infra TI', clp: NO_MATCH_TEXT, csc: 'Computadores/Aluno', isGap: false },
      { theme: 'Qualidade Ensino', pmf: 'Prêmio Desempenho', phen: 'Índice proficiência', clp: 'Nota IDEB', csc: 'Matrículas Tempo Integral', isGap: false },
      { theme: 'Vagas Primeira Inf.', pmf: 'Ampliação Conveniadas', phen: 'Déficit Vagas Nascimentos', clp: 'Escolarização Básica', csc: 'Vagas creches / demografia', isGap: true },
      { theme: 'Abandono Escolar', pmf: NO_MATCH_TEXT, phen: 'Taxa Evassão Escolar', clp: 'Taxa de abandono', csc: NO_MATCH_TEXT, isGap: true },
      { theme: 'Docência', pmf: 'Plano Carreira Mgst', phen: 'Hora/Aula Remuneração', clp: 'Qualificação Corpo Docente', csc: 'Empregos Formaix Educação', isGap: false },
      { theme: 'Ensino Médio', pmf: NO_MATCH_TEXT, phen: NO_MATCH_TEXT, clp: 'Atendimento Médio', csc: 'Taxa Ensino Médio Público', isGap: true },
      { theme: 'Bilinguismo', pmf: 'Básico Inglês/Espanhol', phen: 'Unidades Bilíngues', clp: NO_MATCH_TEXT, csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Transporte Escolar', pmf: 'Rota Certa Estudante', phen: 'Alunos c/ Passe Livre', clp: 'Acesso Infraestrutura', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Educação Especial', pmf: 'Mais Auxiliares Sala', phen: 'Alunos Incluídos Regular', clp: NO_MATCH_TEXT, csc: 'Índice de Acessibilidade', isGap: false },
      { theme: 'Alimentação', pmf: 'Merenda Nutricional Alta', phen: 'Alunos Alimentados/Dia', clp: NO_MATCH_TEXT, csc: NO_MATCH_TEXT, isGap: false }
    ]
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck size={18} />,
    status: 'green',
    clp: ['Morbidade Trânsito', 'Homicídios', 'Segurança Patrimonial', 'Acidentes', 'Mortes por Fogo'],
    smartCities: ['Investimento/Monitoramento', 'Monitoramento Geral', 'Policiamento', 'Mortes Violentas', 'Câmeras/Hab'],
    planoMetas: ['Videomonitoramento (Cerco)', 'Integração GMF/PM', 'Iluminação LED', 'Nova Base GMF', 'Botão Pânico V.D.'],
    floripaNumeros: ['Taxa de homicídios', 'Acidentes Trânsito', 'Gastos Defesa', 'Roubos/Furtos', 'Atendimentos MariaPenha'],
    neutralAnalysis: 'A implementação de Cercos Eletrônicos gabaritou a pauta CSC. Os homicídios são mínimos. O Único alerta real está nos acidentes veiculares (CLP).',
    executiveHighlights2025: ['Iluminação LED 100% Centro', 'OCR 98% nas pontes', 'Homicídios < 15/100k hab'],
    explicitMap: [
      { theme: 'Monitoramento IoT', pmf: 'Câmeras GMF/LED', phen: 'Bairros c/ Telemetria', clp: 'Seg. Patrimonial', csc: 'Investimento Monitoramento', isGap: false },
      { theme: 'Criminalidade Letal', pmf: 'Integração GMF/PM SC', phen: 'Letalidade Violenta', clp: 'Homicídios Anuais', csc: 'Homicídios / 100k hab', isGap: false },
      { theme: 'Acidentes Trânsito', pmf: NO_MATCH_TEXT, phen: 'Sinistros Vias', clp: 'Morbidade Trânsito', csc: 'Mortes no Trânsito', isGap: true },
      { theme: 'Violência Mulher', pmf: 'Botão do Pânico', phen: 'Feminicídios Restritos', clp: 'Violência Gênero', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Defesa Defesa Civil', pmf: 'Monitoramento Encosta', phen: 'Ocorrências Desastre', clp: NO_MATCH_TEXT, csc: 'Centro Controle Clima', isGap: false },
      { theme: 'Policiamento Fisico', pmf: 'Concurso GMF (+100)', phen: 'Efetivo GMF/Hab', clp: NO_MATCH_TEXT, csc: 'Guardas por 10K Hab', isGap: false },
      { theme: 'Drogas/Narcotráfico', pmf: NO_MATCH_TEXT, phen: 'Apreensões GMF', clp: 'Crimes Conexos Tráfico', csc: NO_MATCH_TEXT, isGap: true },
      { theme: 'Roubo de Veículos', pmf: 'Alerta Cerco Eletrônico', phen: 'Roubos B.O.', clp: 'Seg. Patrimonial Roubo', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Prisional/Regresso', pmf: NO_MATCH_TEXT, phen: NO_MATCH_TEXT, clp: 'Taxa Encarceramento', csc: NO_MATCH_TEXT, isGap: true },
      { theme: 'Mortes Indet.', pmf: NO_MATCH_TEXT, phen: 'Óbitos por Armas', clp: 'Morte Causa Indet.', csc: NO_MATCH_TEXT, isGap: true }
    ]
  },
  {
    id: 'economia',
    title: 'Economia',
    icon: <Briefcase size={18} />,
    status: 'green',
    clp: ['Inserção', 'Inovação e Dinamismo', 'Capital Humano', 'Desigualdade', 'Rendimento Médio'],
    smartCities: ['Empresas tech', 'Incubadoras', 'Empregabilidade', 'Custo de Vida', 'PIB Indústria'],
    planoMetas: ['Programa Inovação PII', 'Floripa Simplificada', 'Floripa Empregos', 'Juro Zero', 'Pólo Sapiens'],
    floripaNumeros: ['PIB per capita', 'Empregos Formais', 'Arrecadação ISS', 'Tempo Abertura', 'Empresas Ativas'],
    neutralAnalysis: 'A tecnologia é a matriz propulsora. A prefeitura injeta forte estímulo na desburocratização, gabaritando incubadoras/startups do Smart Cities.',
    executiveHighlights2025: ['Alvará Rápido em 48h (99% CNAEs)', 'Sapiens Park expandido', 'Desemprego mínimo pré-pandemia'],
    explicitMap: [
      { theme: 'Pólo Tech', pmf: 'Programa Inovação Isenção', phen: 'ISS Tech > Turismo', clp: 'Capital Humano Total', csc: 'Empresas Tech Per Capita', isGap: false },
      { theme: 'Desburocratização', pmf: 'Floripa Simplificada', phen: 'Tempo Abertura Empresa', clp: 'Dinamismo Econômico', csc: 'Ecossistema Negócios', isGap: false },
      { theme: 'Empregabilidade', pmf: 'Floripa Mais Empregos', phen: 'Vagas CAGED Saldo', clp: 'Taxa Emprego Formal', csc: 'Crescimento PIB/Emprego', isGap: false },
      { theme: 'Microcrédito', pmf: 'Juro Zero Banco Mun.', phen: 'MEIs financiados', clp: 'Crédito ao Empreendedor', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Custo de Vida', pmf: NO_MATCH_TEXT, phen: 'Cesta Básica/Aluguel', clp: 'Inserção Econômica Real', csc: 'Renda e Custo Vida', isGap: true },
      { theme: 'Qualificação Prof.', pmf: 'Cursos Capacita Floripa', phen: 'Certificados Emitidos', clp: 'Capital Humano Técnico', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Economia Criativa', pmf: 'Fomento Cultura/Turismo', phen: 'CNAEs de Economia Criativa', clp: NO_MATCH_TEXT, csc: 'Economia Criativa (%)', isGap: false },
      { theme: 'Desigualdade', pmf: NO_MATCH_TEXT, phen: 'Índice Gini Municipal', clp: 'Índice de Gini Renda', csc: NO_MATCH_TEXT, isGap: true },
      { theme: 'Turismo Digital', pmf: 'Smart Tourism Floripa', phen: 'Ocupação Leitos/Ano', clp: 'Serviços/Turismo %', csc: 'Turistas Estrangeiros', isGap: false },
      { theme: 'Rendimentos', pmf: NO_MATCH_TEXT, phen: 'Salário Médio Geral', clp: 'Rendimento Médio Formal', csc: 'PIB Per Capita Anual', isGap: true }
    ]
  },
  {
    id: 'meio_ambiente',
    title: 'Meio Ambiente',
    icon: <Leaf size={18} />,
    status: 'yellow',
    clp: ['Saneamento Água', 'Gestão Resíduos', 'Emissões', 'Esgotamento San.', 'Perdas de Água'],
    smartCities: ['Tratamento esgoto', 'Coleta seletiva', 'Áreas verdes', 'Poluição CO2', 'Monitoramento Ar'],
    planoMetas: ['Programa Lixo Zero', 'Revitalização Limpeza', 'Parques Urbanos', 'Ecossistema Mangue', 'Energia Solar'],
    floripaNumeros: ['Parques/Habitante', 'Lixo Reciclado', 'Cobertura Água', 'Volume Tratado CASAN', 'Consumo Sustentável'],
    neutralAnalysis: 'A vanguarda nos orgânicos (Lixo Zero) é brilhante. Todavia, a realidade do Tratamento de Esgoto amarra a nota do CLP gravemente (Limitação CASAN/Estado).',
    executiveHighlights2025: ['Aterro reduzido com Compostagem', 'Parques revitalizados Beira-Mar', 'CASAN atrasa em 55% as ETEs'],
    explicitMap: [
      { theme: 'Coleta Seletiva', pmf: 'Lixo Zero (60% Meta)', phen: 'Tonéis desviados aterro', clp: 'Recuperação Resíduos', csc: 'Coleta Seletiva / Hab', isGap: false },
      { theme: 'Saneamento Esgoto', pmf: NO_MATCH_TEXT, phen: 'Esgoto Tratado (Estado)', clp: 'Cobertura Esgotamento', csc: 'Tratamento Esgoto Geral', isGap: true },
      { theme: 'Parques Verdes', pmf: 'Novos Parques Urbanos', phen: 'Área Verde Preservada M2', clp: 'Sustentabilidade Bioma', csc: 'Índices Área Verde %', isGap: false },
      { theme: 'Déficit/Perda Água', pmf: NO_MATCH_TEXT, phen: 'Índice Perdas CASAN', clp: 'Perdas Distribuição Água', csc: 'Atendimento Água', isGap: true },
      { theme: 'Energia Renovável', pmf: 'LED e Solar Prédios PMF', phen: 'KW gerados Painéis Mun.', clp: 'Emissões CO2 PMF', csc: 'Geração Eólica/Solar', isGap: false },
      { theme: 'Qualidade do Ar', pmf: NO_MATCH_TEXT, phen: 'Monitoramento IMA', clp: NO_MATCH_TEXT, csc: 'Índice Qualidade do Ar', isGap: true },
      { theme: 'Educação Ambiental', pmf: 'Nascentes e Mar Limpo', phen: 'Bandeiras Azuis Praias', clp: NO_MATCH_TEXT, csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Arborização Viária', pmf: 'Plano Floripa Mais Verde', phen: 'Mudas Plantadas (100k)', clp: 'Microclima Urbano', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Logística Reversa', pmf: 'Ecopontos Ampliados', phen: 'Volume de Eletrônicos Rec', clp: 'Gestão Remos', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Vulnerabilidade Clima', pmf: 'PMD Defesa Civil', phen: 'Mapeamento de Áreas Risco', clp: 'Risco Ambiental (Mortes)', csc: 'Centro Controle Clima', isGap: false }
    ]
  },
  {
    id: 'mobilidade',
    title: 'Mobilidade',
    icon: <Bus size={18} />,
    status: 'red',
    clp: ['Qualidade Vias', 'Tempo Deslocamento', 'Mortes Trânsito', 'Frota Veículos', 'Tarifa Público'],
    smartCities: ['Frota GPS', 'Extensão Ciclovias', 'Acessibilidade', 'Modais Integrados', 'Ônibus Hab/Km'],
    planoMetas: ['Asfalto Novo', 'Expansão Cicloviária', 'Floripa Ponto GPS', 'Binários', 'TIF Terminais'],
    floripaNumeros: ['Malha Asfaltada Km', 'Malha Ciclo 25km', 'Passageiros Ônibus', 'Tempo Viagem Ponte', 'Passagens V.E.'],
    neutralAnalysis: 'A mobilidade é o terror avaliativo, com o estrangulamento físico das pontes pesando severamente contra os índices do Município, apesar dos avanços digitais (GPS no app).',
    executiveHighlights2025: ['Frota 100% geolocalizada no App', 'Obras Ciclovias cobrem 110% Ilha', 'Gargalo SC-401 não resolvido'],
    explicitMap: [
      { theme: 'Malha Não-Poluente', pmf: 'Ampliação Ciclovias', phen: 'Extensão Cicloviária Km', clp: 'Políticas Alternativas', csc: 'Extensão Ciclovia/Hab', isGap: false },
      { theme: 'TI no Transporte', pmf: 'Floripa no Ponto', phen: 'Frota Rastreada', clp: 'Modernização Modais', csc: 'Telemetria e GPS Ônibus', isGap: false },
      { theme: 'Tempo Deslocamento', pmf: NO_MATCH_TEXT, phen: 'Lentidão Média Diária (Waze)', clp: 'Tempo Médio Trajeto', csc: 'Conexões Intermodais', isGap: true },
      { theme: 'Qualidade Viária', pmf: 'Programa Asfalto Novo', phen: 'Ruas Capilares Recuperadas', clp: 'Qualidade Rodovias/Vias', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Tarifa Transporte', pmf: 'Subsídio Fundo TP', phen: 'Preço Médio Catraca', clp: 'Acessibilidade Tarifária', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Modais Aquaviários', pmf: NO_MATCH_TEXT, phen: 'Licitação Catamarãs', clp: 'Matriz de Transporte', csc: 'Outros Modais Público', isGap: true },
      { theme: 'Acessibilidade Def...', pmf: 'Frota Piso Baixo', phen: 'Ônibus Adaptados Elevador', clp: NO_MATCH_TEXT, csc: 'Frota Acessível PCD (%)', isGap: false },
      { theme: 'Mortes Trânsito', pmf: NO_MATCH_TEXT, phen: 'Acidentes Graves', clp: 'Custos Acidentes (% PIB)', csc: 'Mortes Trânsito', isGap: true },
      { theme: 'Semaforização IoT', pmf: 'Semáforos Inteligentes', phen: 'Cruzamentos Digitais', clp: NO_MATCH_TEXT, csc: 'Gestão Inteligente Semáforos', isGap: false },
      { theme: 'Frota Particular', pmf: NO_MATCH_TEXT, phen: 'Carros registrados Detran', clp: 'Crescimento Frota x Vias', csc: 'Veículos por Habitante', isGap: true }
    ]
  },
  {
    id: 'governanca',
    title: 'Governança',
    icon: <Landmark size={18} />,
    status: 'green',
    clp: ['Sustentabilidade Fiscal', 'Funcionamento e Transparência', 'Dependência FUNDPM', 'Gastos Pessoal', 'Investimento'],
    smartCities: ['Serviços online', 'Portal Transparência', 'Gestão Dados Abertos', 'Independência Receita', 'APP Cidadão'],
    planoMetas: ['Desburocratização 100%', 'Gov. Nuvem (Ouro)', 'Equilíbrio Caixa (IRT)', 'Redução Dívida', 'Compras Transp.'],
    floripaNumeros: ['Índice Firjan Fiscal', 'Serviços Online %', 'ISS vs Fundo.Part.', 'Comissionados/Efetivos', 'Custo Máquina'],
    neutralAnalysis: 'O selo de Governo 100% Digital unificou Transparência e Online. A arrecadação flutuou bem e fechou as contas, mitigando inseguranças sob a folha de pagamento.',
    executiveHighlights2025: ['Nuvem Ouro completa (Zero Físico)', 'Aprovado Tribunal Contas Sem Ressalva', 'Refis IPTU sucesso absoluto'],
    explicitMap: [
      { theme: 'Serviços Online', pmf: 'Programa Gov. Digital 100%', phen: 'Acessos Pró-cidadão App', clp: 'Transparência Web', csc: 'Serviços 100% Online', isGap: false },
      { theme: 'Caixa do Tesouro', pmf: 'Equilíbrio Receita/Despesa', phen: 'Índice Firjan Finanças', clp: 'Sustentabilidade Fiscal a LP', csc: 'Solidez Fiscal e Ind.', isGap: false },
      { theme: 'Custo da Folha', pmf: NO_MATCH_TEXT, phen: 'LRF % comprometido', clp: 'Gastos Pessoal / Receita', csc: 'Despesas Admin. per Capita', isGap: true },
      { theme: 'Dados Abertos (API)', pmf: 'Portal Floripa Transp.', phen: 'Databases Abertos Gov.', clp: 'Acesso Informação (LAI)', csc: 'Políticas Dados Abertos', isGap: false },
      { theme: 'Indep. Fundo Part.', pmf: 'Aumento Arrecad. Própria ISS', phen: 'Receita Própria vs Transf. Federal', clp: 'Dependência da União', csc: 'Independência Financeira', isGap: false },
      { theme: 'Capacidade Invest.', pmf: 'Caixa e Fundo Desenvolv.', phen: 'CAPEX / Despesa Total', clp: 'Taxa de Investimento (%)', csc: 'Investimento per Capita', isGap: false },
      { theme: 'Corrupção/Ilícitos', pmf: 'Controladoria Rigorosa', phen: 'PADs Mapeados', clp: 'Punição Corrupção/Judic.', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'Compras Públicas', pmf: 'Pregão Eletrônico Inteligente', phen: 'Contratos via Eletrão %', clp: 'Eficiência de Compras Práticas', csc: NO_MATCH_TEXT, isGap: false },
      { theme: 'App Integrado', pmf: 'SuperApp Cidadão Unificado', phen: 'Downloads Cidadão App', clp: NO_MATCH_TEXT, csc: 'App da Cidade Global', isGap: false },
      { theme: 'Plano Diretor', pmf: 'Revisão Plano 2024', phen: 'Alvarás via Novo Plano', clp: 'Planejamento Urbano', csc: 'Ordenamento Territorial', isGap: false }
    ]
  }
];

export const historicalRankingsMock = [
  { year: '2019', clp: 4, csc: 7 },
  { year: '2020', clp: 3, csc: 5 },
  { year: '2021', clp: 2, csc: 4 },
  { year: '2022', clp: 2, csc: 2 },
  { year: '2023', clp: 1, csc: 1 },
  { year: '2024', clp: 1, csc: 1 },
  { year: '2025', clp: 1, csc: 1 },
];

export const radarDataMock = [
  { subject: 'Saúde', floripa: 90, media: 65, fullMark: 100 },
  { subject: 'Educação', floripa: 85, media: 60, fullMark: 100 },
  { subject: 'Segurança', floripa: 88, media: 55, fullMark: 100 },
  { subject: 'Economia', floripa: 95, media: 68, fullMark: 100 },
  { subject: 'Meio Ambiente', floripa: 82, media: 62, fullMark: 100 },
  { subject: 'Mobilidade', floripa: 75, media: 50, fullMark: 100 },
];

export const executionDataMock = [
  { name: 'Saúde', executado: 82, meta: 100 },
  { name: 'Educação', executado: 68, meta: 100 },
  { name: 'Segurança', executado: 95, meta: 100 },
  { name: 'Economia', executado: 100, meta: 100 },
  { name: 'Meio Amb.', executado: 88, meta: 100 },
  { name: 'Mobilidade', executado: 55, meta: 100 },
  { name: 'Gestão', executado: 92, meta: 100 },
];

export const kpisMock = [
  {
    title: "Ranking CLP (Enc. 2025)",
    value: "1º Lugar",
    description: "Competitividade dos Municípios",
    icon: <div className="text-yellow-500">🏆</div>,
    color: "bg-yellow-500/10 border-yellow-500/20"
  },
  {
    title: "Smart Cities (Enc. 2025)",
    value: "1º Lugar",
    description: "Connected Smart Cities geral",
    icon: <div className="text-emerald-500">🎖️</div>,
    color: "bg-emerald-500/10 border-emerald-500/20"
  },
  {
    title: "Execução PMF (Média)",
    value: "82.8%",
    description: "Taxa global de metas concluídas",
    icon: <div className="text-blue-500">📅</div>,
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    title: "Fechamento PIB per Capita",
    value: "R$ 62.410",
    description: "Referência fechamento Fev/2026",
    icon: <div className="text-purple-500">📈</div>,
    color: "bg-purple-500/10 border-purple-500/20"
  }
];
