/**
 * @interface SearchProductsRequest
 * @description Request parameters for product search
 *
 * @property {string} searchTerm - Search term entered by user
 * @property {string} productCode - Specific product code for exact match
 * @property {string[]} categories - Array of category names to filter
 * @property {number} priceMin - Minimum price filter
 * @property {number} priceMax - Maximum price filter
 * @property {string[]} materials - Array of material names to filter
 * @property {string[]} colors - Array of color names to filter
 * @property {string[]} styles - Array of style names to filter
 * @property {number} heightMin - Minimum height in cm
 * @property {number} heightMax - Maximum height in cm
 * @property {number} widthMin - Minimum width in cm
 * @property {number} widthMax - Maximum width in cm
 * @property {number} depthMin - Minimum depth in cm
 * @property {number} depthMax - Maximum depth in cm
 * @property {string} sortBy - Sort criteria
 * @property {number} page - Page number
 * @property {number} pageSize - Items per page
 * @property {string} sessionId - Session identifier for history tracking
 */
export interface SearchProductsRequest {
  searchTerm?: string;
  productCode?: string;
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  colors?: string[];
  styles?: string[];
  heightMin?: number;
  heightMax?: number;
  widthMin?: number;
  widthMax?: number;
  depthMin?: number;
  depthMax?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  sessionId?: string;
}

/**
 * @interface SearchProduct
 * @description Product information in search results
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
 * @property {string} imageUrl - Product image URL
 * @property {Date} dateCreated - Product creation date
 */
export interface SearchProduct {
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
  imageUrl: string | null;
  dateCreated: Date;
}

/**
 * @interface SearchMetadata
 * @description Metadata about search results
 *
 * @property {number} totalResults - Total number of results found
 * @property {number} page - Current page number
 * @property {number} pageSize - Items per page
 * @property {number} totalPages - Total number of pages
 */
export interface SearchMetadata {
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * @interface SearchProductsResponse
 * @description Complete search response with results and metadata
 *
 * @property {SearchProduct[]} products - Array of product results
 * @property {SearchMetadata} metadata - Search metadata
 */
export interface SearchProductsResponse {
  products: SearchProduct[];
  metadata: SearchMetadata;
}

/**
 * @interface AutocompleteSuggestion
 * @description Autocomplete suggestion item
 *
 * @property {string} suggestion - Suggested search term
 * @property {string} type - Type of suggestion (product, category, popular)
 * @property {number} relevance - Relevance score
 */
export interface AutocompleteSuggestion {
  suggestion: string;
  type: string;
  relevance: number;
}

/**
 * @interface FilterOption
 * @description Filter option with product count
 *
 * @property {string} value - Filter value
 * @property {number} productCount - Number of products with this value
 */
export interface FilterOption {
  value: string;
  productCount: number;
}

/**
 * @interface FilterOptions
 * @description Available filter options
 *
 * @property {FilterOption[]} categories - Available categories
 * @property {FilterOption[]} materials - Available materials
 * @property {FilterOption[]} colors - Available colors
 * @property {FilterOption[]} styles - Available styles
 * @property {number} minPrice - Minimum price in catalog
 * @property {number} maxPrice - Maximum price in catalog
 * @property {number} minHeight - Minimum height in catalog
 * @property {number} maxHeight - Maximum height in catalog
 * @property {number} minWidth - Minimum width in catalog
 * @property {number} maxWidth - Maximum width in catalog
 * @property {number} minDepth - Minimum depth in catalog
 * @property {number} maxDepth - Maximum depth in catalog
 */
export interface FilterOptions {
  categories: FilterOption[];
  materials: FilterOption[];
  colors: FilterOption[];
  styles: FilterOption[];
  minPrice: number;
  maxPrice: number;
  minHeight: number | null;
  maxHeight: number | null;
  minWidth: number | null;
  maxWidth: number | null;
  minDepth: number | null;
  maxDepth: number | null;
}

/**
 * @interface RelatedProduct
 * @description Related product for no-results scenarios
 *
 * @property {number} idProduct - Product identifier
 * @property {string} productCode - Product code
 * @property {string} name - Product name
 * @property {string} category - Product category
 * @property {number} price - Product price
 * @property {string} imageUrl - Product image URL
 */
export interface RelatedProduct {
  idProduct: number;
  productCode: string;
  name: string;
  category: string | null;
  price: number;
  imageUrl: string | null;
}

/**
 * @interface SearchAlternatives
 * @description Alternative suggestions and related products
 *
 * @property {string[]} suggestions - Alternative search terms
 * @property {RelatedProduct[]} relatedProducts - Related products
 */
export interface SearchAlternatives {
  suggestions: string[];
  relatedProducts: RelatedProduct[];
}
