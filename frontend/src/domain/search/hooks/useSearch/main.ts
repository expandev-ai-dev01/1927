import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '../../stores/searchStore';
import { searchService } from '../../services/searchService';
import type { SearchParams } from '../../types';

export const useSearch = () => {
  const { searchTerm, filters, sortBy, currentPage, itemsPerPage, addToHistory } = useSearchStore();

  const searchParams: SearchParams = {
    termo_busca: searchTerm || undefined,
    filtros: Object.keys(filters).length > 0 ? filters : undefined,
    ordenacao: sortBy,
    pagina_atual: currentPage,
    itens_por_pagina: itemsPerPage,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: async () => {
      const result = await searchService.search(searchParams);

      // Add to history if there's a search term
      if (searchTerm) {
        addToHistory({
          termo: searchTerm,
          filtros: filters,
          data: new Date().toISOString(),
          total_resultados: result.total,
        });
      }

      return result;
    },
    enabled: !!searchTerm || Object.keys(filters).length > 0,
  });

  return {
    results: data?.resultados || [],
    total: data?.total || 0,
    totalPages: data?.total_paginas || 0,
    currentPage: data?.pagina_atual || 1,
    suggestions: data?.sugestoes_alternativas || [],
    relatedProducts: data?.produtos_relacionados || [],
    isLoading,
    error,
    refetch,
  };
};
