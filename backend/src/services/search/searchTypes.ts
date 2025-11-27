/**
 * @interface SearchProductParams
 * @description Parameters for product search operation
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [searchTerm] - Search term (optional)
 * @property {SearchFilters} [filters] - Filter object (optional)
 * @property {string} [sortBy] - Sort criteria (optional)
 * @property {number} [pageNumber] - Page number (optional)
 * @property {number} [pageSize] - Items per page (optional)
 */
export interface SearchProductParams {
  idAccount: number;
  searchTerm?: string;
  filters?: SearchFilters;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: 12 | 24 | 36 | 48;
}

/**
 * @interface SearchFilters
 * @description Filter parameters for product search
 *
 * @property {string[]} [categories] - Category filters (optional)
 * @property {number} [priceMin] - Minimum price filter (optional)
 * @property {number} [priceMax] - Maximum price filter (optional)
 * @property {string[]} [materials] - Material filters (optional)
 * @property {string[]} [colors] - Color filters (optional)
 * @property {string[]} [styles] - Style filters (optional)
 * @property {DimensionFilters} [dimensions] - Dimension filters (optional)
 */
export interface SearchFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  colors?: string[];
  styles?: string[];
  dimensions?: DimensionFilters;
}

/**
 * @interface DimensionFilters
 * @description Dimension filter parameters
 *
 * @property {number} [heightMin] - Minimum height in cm (optional)
 * @property {number} [heightMax] - Maximum height in cm (optional)
 * @property {number} [widthMin] - Minimum width in cm (optional)
 * @property {number} [widthMax] - Maximum width in cm (optional)
 * @property {number} [depthMin] - Minimum depth in cm (optional)
 * @property {number} [depthMax] - Maximum depth in cm (optional)
 */
export interface DimensionFilters {
  heightMin?: number;
  heightMax?: number;
  widthMin?: number;
  widthMax?: number;
  depthMin?: number;
  depthMax?: number;
}

/**
 * @interface SearchResult
 * @description Product search result
 *
 * @property {number} idProduct - Product identifier
 * @property {string} productCode - Product code
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {string} category - Product category
 * @property {string} material - Product material
 * @property {string} color - Product color
 * @property {string} style - Product style
 * @property {number} price - Product price
 * @property {number} height - Product height in cm
 * @property {number} width - Product width in cm
 * @property {number} depth - Product depth in cm
 * @property {Date} dateCreated - Product creation date
 * @property {number} totalResults - Total number of results
 * @property {number} totalPages - Total number of pages
 * @property {number} currentPage - Current page number
 */
export interface SearchResult {
  idProduct: number;
  productCode: string;
  name: string;
  description: string | null;
  category: string | null;
  material: string | null;
  color: string | null;
  style: string | null;
  price: number;
  height: number | null;
  width: number | null;
  depth: number | null;
  dateCreated: Date;
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

/**
 * @interface SearchSuggestionsParams
 * @description Parameters for search suggestions
 *
 * @property {number} idAccount - Account identifier
 * @property {string} partialTerm - Partial search term
 * @property {number} [maxSuggestions] - Maximum suggestions (optional)
 */
export interface SearchSuggestionsParams {
  idAccount: number;
  partialTerm: string;
  maxSuggestions?: number;
}

/**
 * @interface SearchSuggestion
 * @description Search suggestion result
 *
 * @property {string} suggestion - Suggested term
 * @property {string} type - Suggestion type (product, category, synonym)
 * @property {number} priority - Priority score
 */
export interface SearchSuggestion {
  suggestion: string;
  type: string;
  priority: number;
}

/**
 * @interface SearchHistoryCreateParams
 * @description Parameters for creating search history
 *
 * @property {number} idAccount - Account identifier
 * @property {string} searchTerm - Search term used
 * @property {string} [filters] - Applied filters as JSON string (optional)
 * @property {number} resultCount - Number of results found
 */
export interface SearchHistoryCreateParams {
  idAccount: number;
  searchTerm: string;
  filters?: string;
  resultCount: number;
}

/**
 * @interface SearchHistoryItem
 * @description Search history item
 *
 * @property {number} idSearchHistory - Search history identifier
 * @property {string} searchTerm - Search term used
 * @property {string} filters - Applied filters (JSON)
 * @property {number} resultCount - Number of results found
 * @property {Date} dateCreated - Search execution date
 */
export interface SearchHistoryItem {
  idSearchHistory: number;
  searchTerm: string;
  filters: string | null;
  resultCount: number;
  dateCreated: Date;
}

/**
 * @interface FilterOptionsParams
 * @description Parameters for retrieving filter options with progressive refinement
 *
 * @property {string[]} [categories] - Currently selected categories (optional)
 * @property {number} [priceMin] - Currently selected minimum price (optional)
 * @property {number} [priceMax] - Currently selected maximum price (optional)
 * @property {string[]} [materials] - Currently selected materials (optional)
 * @property {string[]} [colors] - Currently selected colors (optional)
 * @property {string[]} [styles] - Currently selected styles (optional)
 */
export interface FilterOptionsParams {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  colors?: string[];
  styles?: string[];
}

/**
 * @interface FilterOptions
 * @description Available filter options from catalog
 *
 * @property {string[]} categories - Available categories
 * @property {string[]} materials - Available materials
 * @property {string[]} colors - Available colors
 * @property {string[]} styles - Available styles
 * @property {PriceRange} priceRange - Price range
 * @property {DimensionRanges} dimensionRanges - Dimension ranges
 */
export interface FilterOptions {
  categories: string[];
  materials: string[];
  colors: string[];
  styles: string[];
  priceRange: PriceRange;
  dimensionRanges: DimensionRanges;
}

/**
 * @interface PriceRange
 * @description Price range information
 *
 * @property {number} minPrice - Minimum price
 * @property {number} maxPrice - Maximum price
 */
export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

/**
 * @interface DimensionRanges
 * @description Dimension ranges information
 *
 * @property {number} minHeight - Minimum height
 * @property {number} maxHeight - Maximum height
 * @property {number} minWidth - Minimum width
 * @property {number} maxWidth - Maximum width
 * @property {number} minDepth - Minimum depth
 * @property {number} maxDepth - Maximum depth
 */
export interface DimensionRanges {
  minHeight: number | null;
  maxHeight: number | null;
  minWidth: number | null;
  maxWidth: number | null;
  minDepth: number | null;
  maxDepth: number | null;
}
