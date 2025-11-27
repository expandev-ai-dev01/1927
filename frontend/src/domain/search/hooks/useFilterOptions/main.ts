import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';

export const useFilterOptions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['filter-options'],
    queryFn: searchService.getFilterOptions,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    options: data,
    isLoading,
    error,
  };
};
