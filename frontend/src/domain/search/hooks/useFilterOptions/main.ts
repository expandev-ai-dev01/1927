import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';
import { useSearchStore } from '../../stores/searchStore';

export const useFilterOptions = () => {
  const { filters } = useSearchStore();

  const { data, isLoading } = useQuery({
    queryKey: ['filterOptions', filters],
    queryFn: () => searchService.getFilterOptions(filters),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    filterOptions: data,
    isLoading,
  };
};
