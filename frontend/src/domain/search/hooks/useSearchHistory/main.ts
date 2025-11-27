import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';
import type { SearchHistoryItem } from '../../types/search';

export const useSearchHistory = () => {
  const queryClient = useQueryClient();
  const queryKey = ['search', 'history'];

  const { data, isLoading } = useQuery<SearchHistoryItem[]>({
    queryKey,
    queryFn: () => searchService.getSearchHistory(),
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: createHistory } = useMutation({
    mutationFn: (params: { searchTerm: string; filters?: string; resultCount: number }) =>
      searchService.createSearchHistory(params.searchTerm, params.filters, params.resultCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    history: data ?? [],
    isLoading,
    createHistory,
  };
};
