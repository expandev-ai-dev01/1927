import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';

export const useSearchHistory = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => searchService.getHistory(10),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  return {
    history: data || [],
    isLoading,
    refetch,
  };
};
