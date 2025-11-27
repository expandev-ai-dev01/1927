import { authenticatedClient } from '@/core/lib/api';
import type {
  SearchParams,
  SearchResult,
  SearchSuggestion,
  SearchHistoryItem,
  FilterOptions,
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

    if (params.productCode) {
      queryParams.append('productCode', params.productCode);
    }

    if (params.filters?.categories?.length) {
      queryParams.append('categories', JSON.stringify(params.filters.categories));
    }

    if (params.filters?.priceMin !== undefined && params.filters.priceMin !== null) {
      queryParams.append('priceMin', params.filters.priceMin.toString());
    }

    if (params.filters?.priceMax !== undefined && params.filters.priceMax !== null) {
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

    if (params.filters?.dimensions) {
      const dims = params.filters.dimensions;
      if (dims.heightMin !== undefined && dims.heightMin !== null) {
        queryParams.append('heightMin', dims.heightMin.toString());
      }
      if (dims.heightMax !== undefined && dims.heightMax !== null) {
        queryParams.append('heightMax', dims.heightMax.toString());
      }
      if (dims.widthMin !== undefined && dims.widthMin !== null) {
        queryParams.append('widthMin', dims.widthMin.toString());
      }
      if (dims.widthMax !== undefined && dims.widthMax !== null) {
        queryParams.append('widthMax', dims.widthMax.toString());
      }
      if (dims.depthMin !== undefined && dims.depthMin !== null) {
        queryParams.append('depthMin', dims.depthMin.toString());
      }
      if (dims.depthMax !== undefined && dims.depthMax !== null) {
        queryParams.append('depthMax', dims.depthMax.toString());
      }
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
   * Get autocomplete suggestions
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
  async getHistory(maxResults?: number): Promise<SearchHistoryItem[]> {
    const queryParams = maxResults ? `?maxResults=${maxResults}` : '';
    const { data } = await authenticatedClient.get(`/search/history${queryParams}`);
    return data.data;
  },

  /**
   * Create search history entry
   */
  async createHistory(searchTerm: string, filters?: string, resultCount?: number): Promise<void> {
    await authenticatedClient.post('/search/history', {
      searchTerm,
      filters,
      resultCount: resultCount || 0,
    });
  },

  /**
   * Get available filter options
   */
  async getFilterOptions(currentFilters?: SearchParams['filters']): Promise<FilterOptions> {
    const queryParams = new URLSearchParams();

    if (currentFilters?.categories?.length) {
      queryParams.append('categories', JSON.stringify(currentFilters.categories));
    }

    if (currentFilters?.priceMin !== undefined && currentFilters.priceMin !== null) {
      queryParams.append('priceMin', currentFilters.priceMin.toString());
    }

    if (currentFilters?.priceMax !== undefined && currentFilters.priceMax !== null) {
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

    const queryString = queryParams.toString();
    const url = queryString ? `/search/filter-options?${queryString}` : '/search/filter-options';

    const { data } = await authenticatedClient.get(url);
    return data.data;
  },
};
