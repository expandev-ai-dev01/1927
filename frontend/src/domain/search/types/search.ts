export interface SearchFilters {
  categories?: string[];
  priceMin?: number | null;
  priceMax?: number | null;
  materials?: string[];
  colors?: string[];
  styles?: string[];
  heightMin?: number | null;
  heightMax?: number | null;
  widthMin?: number | null;
  widthMax?: number | null;
  depthMin?: number | null;
  depthMax?: number | null;
}

export interface SearchParams {
  searchTerm?: string;
  productCode?: string;
  filters?: SearchFilters;
  sortBy?:
    | 'relevancia'
    | 'nome_asc'
    | 'nome_desc'
    | 'preco_asc'
    | 'preco_desc'
    | 'data_cadastro_desc';
  page?: number;
  pageSize?: 12 | 24 | 36 | 48;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  material: string;
  color: string;
  style: string;
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  createdAt: string;
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOptions {
  categories: Array<{ name: string; count: number }>;
  materials: Array<{ name: string; count: number }>;
  colors: Array<{ name: string; count: number }>;
  styles: Array<{ name: string; count: number }>;
  priceRange: { min: number; max: number };
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

export interface SearchHistory {
  id: string;
  searchTerm: string;
  filters?: string;
  resultCount: number;
  createdAt: string;
}

export interface AppliedFilter {
  type: 'category' | 'price' | 'material' | 'color' | 'style' | 'dimensions';
  label: string;
  value: string;
}
