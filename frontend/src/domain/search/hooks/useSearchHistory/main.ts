import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services';

export const useSearchHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', 'history'],
    queryFn: () => searchService.getHistory(),
  });

  return {
    history: data ?? [],
    isLoading,
    error,
  };
};
