import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '../../stores/searchStore';
import { searchService } from '../../services/searchService';
import type { SearchParams } from '../../types/search';

export const useSearch = () => {
  const queryClient = useQueryClient();
  const { searchTerm, filters, sortBy, currentPage, pageSize, setIsLoading, addToHistory } =
    useSearchStore();

  const searchParams: SearchParams = {
    searchTerm: searchTerm || undefined,
    filters,
    sortBy,
    pageNumber: currentPage,
    pageSize,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const result = await searchService.searchProducts(searchParams);

        // Add to history if search term exists
        if (searchTerm) {
          await searchService.createHistory(
            searchTerm,
            JSON.stringify(filters),
            result.totalResults
          );
        }

        return result;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: true,
  });

  const { mutateAsync: createHistoryEntry } = useMutation({
    mutationFn: (params: { searchTerm: string; filters?: string; resultCount: number }) =>
      searchService.createHistory(params.searchTerm, params.filters, params.resultCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });

  return {
    searchResult: data,
    isLoading,
    error,
    refetch,
    createHistoryEntry,
  };
};
