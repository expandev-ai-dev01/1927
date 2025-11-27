import { dbRequest, ExpectedReturn, IRecordSet } from '@/utils/database';
import {
  SearchProductParams,
  SearchResult,
  SearchHistoryCreateParams,
  FilterOptions,
  SearchSuggestionsParams,
  SearchSuggestion,
  SearchHistoryItem,
  FilterOptionsParams,
} from './searchTypes';

/**
 * @summary
 * Performs comprehensive product search with filters and pagination
 *
 * @function searchProductList
 * @module search
 *
 * @param {SearchProductParams} params - Search parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.searchTerm] - Search term
 * @param {object} [params.filters] - Filter object
 * @param {string} [params.sortBy] - Sort criteria
 * @param {number} [params.pageNumber] - Page number
 * @param {number} [params.pageSize] - Items per page
 *
 * @returns {Promise<{products: SearchResult[], totalResults: number, pageNumber: number, pageSize: number, totalPages: number}>} Search results with pagination info
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function searchProductList(params: SearchProductParams): Promise<{
  products: SearchResult[];
  totalResults: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}> {
  const filters = params.filters || {};
  const dimensions = filters.dimensions || {};

  const dbParams = {
    idAccount: params.idAccount,
    searchTerm: params.searchTerm || null,
    productCode: null,
    categories: filters.categories ? JSON.stringify(filters.categories) : null,
    priceMin: filters.priceMin ?? null,
    priceMax: filters.priceMax ?? null,
    materials: filters.materials ? JSON.stringify(filters.materials) : null,
    colors: filters.colors ? JSON.stringify(filters.colors) : null,
    styles: filters.styles ? JSON.stringify(filters.styles) : null,
    heightMin: dimensions.heightMin ?? null,
    heightMax: dimensions.heightMax ?? null,
    widthMin: dimensions.widthMin ?? null,
    widthMax: dimensions.widthMax ?? null,
    depthMin: dimensions.depthMin ?? null,
    depthMax: dimensions.depthMax ?? null,
    sortBy: params.sortBy || 'relevancia',
    page: params.pageNumber || 1,
    pageSize: params.pageSize || 24,
  };

  const result = await dbRequest(
    '[functional].[spSearchProductList]',
    dbParams,
    ExpectedReturn.Multi
  );

  const products = result as SearchResult[];

  if (products.length === 0) {
    return {
      products: [],
      totalResults: 0,
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 24,
      totalPages: 0,
    };
  }

  return {
    products,
    totalResults: products[0].totalResults,
    pageNumber: products[0].currentPage,
    pageSize: params.pageSize || 24,
    totalPages: products[0].totalPages,
  };
}

/**
 * @summary
 * Provides autocomplete suggestions for search input
 *
 * @function searchSuggestionsGet
 * @module search
 *
 * @param {number} idAccount - Account identifier
 * @param {string} partialTerm - Partial search term
 * @param {number} [maxSuggestions] - Maximum suggestions
 *
 * @returns {Promise<SearchSuggestion[]>} Autocomplete suggestions
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function searchSuggestionsGet(
  idAccount: number,
  partialTerm: string,
  maxSuggestions?: number
): Promise<SearchSuggestion[]> {
  const result = await dbRequest(
    '[functional].[spSearchSuggestionsGet]',
    {
      idAccount,
      partialTerm,
      maxSuggestions: maxSuggestions || 10,
    },
    ExpectedReturn.Multi
  );

  return result as SearchSuggestion[];
}

/**
 * @summary
 * Records a search operation in history
 *
 * @function searchHistoryCreate
 * @module search
 *
 * @param {SearchHistoryCreateParams} params - Search history parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} params.searchTerm - Search term used
 * @param {string} [params.filters] - Applied filters (JSON)
 * @param {number} params.resultCount - Number of results found
 *
 * @returns {Promise<{idSearchHistory: number}>} Created history record ID
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function searchHistoryCreate(
  params: SearchHistoryCreateParams
): Promise<{ idSearchHistory: number }> {
  const result = await dbRequest(
    '[functional].[spSearchHistoryCreate]',
    {
      idAccount: params.idAccount,
      searchTerm: params.searchTerm,
      filters: params.filters || null,
      resultCount: params.resultCount,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves search history for an account
 *
 * @function searchHistoryList
 * @module search
 *
 * @param {number} idAccount - Account identifier
 * @param {number} [maxResults] - Maximum history items
 *
 * @returns {Promise<SearchHistoryItem[]>} Search history items
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function searchHistoryList(
  idAccount: number,
  maxResults?: number
): Promise<SearchHistoryItem[]> {
  const result = await dbRequest(
    '[functional].[spSearchHistoryList]',
    {
      idAccount,
      maxResults: maxResults || 10,
    },
    ExpectedReturn.Multi
  );

  return result as SearchHistoryItem[];
}

/**
 * @summary
 * Retrieves available filter options from catalog with progressive refinement
 *
 * @function searchFilterOptionsGet
 * @module search
 *
 * @param {number} idAccount - Account identifier
 * @param {FilterOptionsParams} [currentFilters] - Currently applied filters
 *
 * @returns {Promise<FilterOptions>} Available filter options
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function searchFilterOptionsGet(
  idAccount: number,
  currentFilters?: FilterOptionsParams
): Promise<FilterOptions> {
  const filters = currentFilters || {};

  const dbParams = {
    idAccount,
    categories: filters.categories ? JSON.stringify(filters.categories) : null,
    priceMin: filters.priceMin ?? null,
    priceMax: filters.priceMax ?? null,
    materials: filters.materials ? JSON.stringify(filters.materials) : null,
    colors: filters.colors ? JSON.stringify(filters.colors) : null,
    styles: filters.styles ? JSON.stringify(filters.styles) : null,
  };

  const results = (await dbRequest(
    '[functional].[spSearchFilterOptionsGet]',
    dbParams,
    ExpectedReturn.Multi
  )) as IRecordSet<any>[];

  const categories = results[0].map((row: any) => row.category);
  const materials = results[1].map((row: any) => row.material);
  const colors = results[2].map((row: any) => row.color);
  const styles = results[3].map((row: any) => row.style);
  const priceRange = results[4][0];
  const dimensionRanges = results[5][0];

  return {
    categories,
    materials,
    colors,
    styles,
    priceRange,
    dimensionRanges,
  };
}
