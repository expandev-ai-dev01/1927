export interface SearchFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  colors?: string[];
  styles?: string[];
  dimensions?: {
    heightMin?: number;
    heightMax?: number;
    widthMin?: number;
    widthMax?: number;
    depthMin?: number;
    depthMax?: number;
  };
}

export interface SearchParams {
  searchTerm?: string;
  filters?: SearchFilters;
  sortBy?:
    | 'relevancia'
    | 'nome_asc'
    | 'nome_desc'
    | 'preco_asc'
    | 'preco_desc'
    | 'data_cadastro_desc';
  pageNumber?: number;
  pageSize?: 12 | 24 | 36 | 48;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  material?: string;
  color?: string;
  style?: string;
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
  };
}

export interface SearchResult {
  products: Product[];
  totalResults: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterOptions {
  categories: FilterOption[];
  materials: FilterOption[];
  colors: FilterOption[];
  styles: FilterOption[];
  priceRange: {
    min: number;
    max: number;
  };
  dimensionRanges: {
    height: { min: number; max: number };
    width: { min: number; max: number };
    depth: { min: number; max: number };
  };
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'term';
  priority: number;
}

export interface SearchHistoryItem {
  id: number;
  searchTerm: string;
  filters?: string;
  resultCount: number;
  createdAt: string;
}

export interface AppliedFilter {
  type: 'category' | 'price' | 'material' | 'color' | 'style' | 'dimension';
  label: string;
  value: string | number;
  displayValue: string;
}
