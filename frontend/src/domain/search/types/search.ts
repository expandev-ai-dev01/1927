export interface SearchFilters {
  categoria?: string[];
  faixa_preco?: {
    minimo: number | null;
    maximo: number | null;
  };
  material?: string[];
  cor?: string[];
  estilo?: string[];
  dimensoes?: {
    altura?: { minimo: number | null; maximo: number | null };
    largura?: { minimo: number | null; maximo: number | null };
    profundidade?: { minimo: number | null; maximo: number | null };
  };
}

export interface SearchParams {
  termo_busca?: string;
  codigo_produto?: string;
  filtros?: SearchFilters;
  ordenacao?:
    | 'relevancia'
    | 'nome_asc'
    | 'nome_desc'
    | 'preco_asc'
    | 'preco_desc'
    | 'data_cadastro_desc';
  pagina_atual?: number;
  itens_por_pagina?: number;
}

export interface SearchResult {
  id: string;
  nome: string;
  codigo: string;
  descricao: string;
  preco: number;
  imagem_principal: string;
  categoria: string;
  material?: string;
  cor?: string;
  estilo?: string;
  dimensoes?: {
    altura?: number;
    largura?: number;
    profundidade?: number;
  };
}

export interface SearchResponse {
  resultados: SearchResult[];
  total: number;
  pagina_atual: number;
  total_paginas: number;
  sugestoes_alternativas?: string[];
  produtos_relacionados?: SearchResult[];
}

export interface SearchHistoryItem {
  termo: string;
  filtros?: SearchFilters;
  data: string;
  total_resultados: number;
}

export interface SearchFavorite {
  id: string;
  nome: string;
  termo?: string;
  filtros?: SearchFilters;
  data_criacao: string;
}

export interface FilterOptions {
  categorias: string[];
  materiais: string[];
  cores: string[];
  estilos: string[];
  preco_minimo: number;
  preco_maximo: number;
}

export interface AppliedFilter {
  tipo: string;
  valor: string | number | { minimo: number | null; maximo: number | null };
  label: string;
}
