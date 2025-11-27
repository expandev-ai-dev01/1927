import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services';

export const useFilterOptions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', 'filter-options'],
    queryFn: () => searchService.getFilterOptions(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return {
    filterOptions: data,
    isLoading,
    error,
  };
};
