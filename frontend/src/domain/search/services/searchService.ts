import { authenticatedClient } from '@/core/lib/api';
import type { SearchParams, SearchResponse, FilterOptions } from '../types';

/**
 * @service SearchService
 * @domain search
 * @type REST API Service
 */
export const searchService = {
  /**
   * Realiza busca de produtos com filtros e paginação
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const { data } = await authenticatedClient.get<SearchResponse>('/produtos/busca', {
      params,
    });
    return data;
  },

  /**
   * Obtém opções disponíveis para filtros
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const { data } = await authenticatedClient.get<FilterOptions>('/produtos/filtros');
    return data;
  },

  /**
   * Obtém sugestões de autocomplete
   */
  async getAutocompleteSuggestions(termo: string): Promise<string[]> {
    const { data } = await authenticatedClient.get<string[]>('/produtos/autocomplete', {
      params: { termo },
    });
    return data;
  },
};
