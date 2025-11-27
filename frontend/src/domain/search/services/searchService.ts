import { authenticatedClient } from '@/core/lib/api';
import type {
  SearchParams,
  SearchResult,
  FilterOptions,
  SearchSuggestion,
  SearchHistoryItem,
} from '../types/search';

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

    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }

    if (params.filters?.categories?.length) {
      queryParams.append('categories', JSON.stringify(params.filters.categories));
    }

    if (params.filters?.priceMin !== undefined) {
      queryParams.append('priceMin', params.filters.priceMin.toString());
    }

    if (params.filters?.priceMax !== undefined) {
      queryParams.append('priceMax', params.filters.priceMax.toString());
    }

    if (params.filters?.materials?.length) {
      queryParams.append('materials', JSON.stringify(params.filters.materials));
    }

    if (params.filters?.colors?.length) {
      queryParams.append('colors', JSON.stringify(params.filters.colors));
    }

    if (params.filters?.styles?.length) {
      queryParams.append('styles', JSON.stringify(params.filters.styles));
    }

    if (params.filters?.dimensions?.heightMin !== undefined) {
      queryParams.append('heightMin', params.filters.dimensions.heightMin.toString());
    }

    if (params.filters?.dimensions?.heightMax !== undefined) {
      queryParams.append('heightMax', params.filters.dimensions.heightMax.toString());
    }

    if (params.filters?.dimensions?.widthMin !== undefined) {
      queryParams.append('widthMin', params.filters.dimensions.widthMin.toString());
    }

    if (params.filters?.dimensions?.widthMax !== undefined) {
      queryParams.append('widthMax', params.filters.dimensions.widthMax.toString());
    }

    if (params.filters?.dimensions?.depthMin !== undefined) {
      queryParams.append('depthMin', params.filters.dimensions.depthMin.toString());
    }

    if (params.filters?.dimensions?.depthMax !== undefined) {
      queryParams.append('depthMax', params.filters.dimensions.depthMax.toString());
    }

    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }

    if (params.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }

    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const { data } = await authenticatedClient.get(`/search/products?${queryParams.toString()}`);
    return data.data;
  },

  /**
   * Get available filter options
   */
  async getFilterOptions(currentFilters?: SearchParams['filters']): Promise<FilterOptions> {
    const queryParams = new URLSearchParams();

    if (currentFilters?.categories?.length) {
      queryParams.append('categories', JSON.stringify(currentFilters.categories));
    }

    if (currentFilters?.priceMin !== undefined) {
      queryParams.append('priceMin', currentFilters.priceMin.toString());
    }

    if (currentFilters?.priceMax !== undefined) {
      queryParams.append('priceMax', currentFilters.priceMax.toString());
    }

    if (currentFilters?.materials?.length) {
      queryParams.append('materials', JSON.stringify(currentFilters.materials));
    }

    if (currentFilters?.colors?.length) {
      queryParams.append('colors', JSON.stringify(currentFilters.colors));
    }

    if (currentFilters?.styles?.length) {
      queryParams.append('styles', JSON.stringify(currentFilters.styles));
    }

    const { data } = await authenticatedClient.get(
      `/search/filter-options${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    return data.data;
  },

  /**
   * Get search suggestions for autocomplete
   */
  async getSuggestions(partialTerm: string, maxSuggestions?: number): Promise<SearchSuggestion[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('partialTerm', partialTerm);

    if (maxSuggestions) {
      queryParams.append('maxSuggestions', maxSuggestions.toString());
    }

    const { data } = await authenticatedClient.get(`/search/suggestions?${queryParams.toString()}`);
    return data.data;
  },

  /**
   * Get search history
   */
  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    const { data } = await authenticatedClient.get('/search/history');
    return data.data;
  },

  /**
   * Create search history entry
   */
  async createSearchHistory(
    searchTerm: string,
    filters: string | undefined,
    resultCount: number
  ): Promise<SearchHistoryItem> {
    const { data } = await authenticatedClient.post('/search/history', {
      searchTerm,
      filters,
      resultCount,
    });
    return data.data;
  },
};
