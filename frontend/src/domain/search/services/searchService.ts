import { authenticatedClient } from '@/core/lib/api';
import type {
  SearchParams,
  SearchResult,
  FilterOptions,
  SearchSuggestion,
  SearchHistory,
} from '../types';

/**
 * @service SearchService
 * @domain search
 * @type REST API Integration
 */
export const searchService = {
  /**
   * Search products with filters and pagination
   */
  async searchProducts(params: SearchParams): Promise<SearchResult> {
    const queryParams = new URLSearchParams();

    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.productCode) queryParams.append('productCode', params.productCode);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    if (params.filters) {
      if (params.filters.categories?.length) {
        queryParams.append('categories', JSON.stringify(params.filters.categories));
      }
      if (params.filters.priceMin !== undefined && params.filters.priceMin !== null) {
        queryParams.append('priceMin', params.filters.priceMin.toString());
      }
      if (params.filters.priceMax !== undefined && params.filters.priceMax !== null) {
        queryParams.append('priceMax', params.filters.priceMax.toString());
      }
      if (params.filters.materials?.length) {
        queryParams.append('materials', JSON.stringify(params.filters.materials));
      }
      if (params.filters.colors?.length) {
        queryParams.append('colors', JSON.stringify(params.filters.colors));
      }
      if (params.filters.styles?.length) {
        queryParams.append('styles', JSON.stringify(params.filters.styles));
      }
      if (params.filters.heightMin !== undefined && params.filters.heightMin !== null) {
        queryParams.append('heightMin', params.filters.heightMin.toString());
      }
      if (params.filters.heightMax !== undefined && params.filters.heightMax !== null) {
        queryParams.append('heightMax', params.filters.heightMax.toString());
      }
      if (params.filters.widthMin !== undefined && params.filters.widthMin !== null) {
        queryParams.append('widthMin', params.filters.widthMin.toString());
      }
      if (params.filters.widthMax !== undefined && params.filters.widthMax !== null) {
        queryParams.append('widthMax', params.filters.widthMax.toString());
      }
      if (params.filters.depthMin !== undefined && params.filters.depthMin !== null) {
        queryParams.append('depthMin', params.filters.depthMin.toString());
      }
      if (params.filters.depthMax !== undefined && params.filters.depthMax !== null) {
        queryParams.append('depthMax', params.filters.depthMax.toString());
      }
    }

    const { data } = await authenticatedClient.get(`/search/products?${queryParams.toString()}`);
    return data.data;
  },

  /**
   * Get available filter options from catalog
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const { data } = await authenticatedClient.get('/search/filter-options');
    return data.data;
  },

  /**
   * Get autocomplete suggestions
   */
  async getSuggestions(partialTerm: string): Promise<SearchSuggestion[]> {
    const { data } = await authenticatedClient.get('/search/suggestions', {
      params: { partialTerm },
    });
    return data.data.suggestions;
  },

  /**
   * Get search history
   */
  async getHistory(): Promise<SearchHistory[]> {
    const { data } = await authenticatedClient.get('/search/history');
    return data.data.history;
  },

  /**
   * Create search history entry
   */
  async createHistory(params: {
    searchTerm: string;
    filters?: string;
    resultCount: number;
  }): Promise<SearchHistory> {
    const { data } = await authenticatedClient.post('/search/history', params);
    return data.data.history;
  },
};
