import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';
import type { FilterOptions, SearchFilters } from '../../types/search';

export interface UseFilterOptionsOptions {
  currentFilters?: SearchFilters;
  enabled?: boolean;
}

export const useFilterOptions = (options: UseFilterOptionsOptions = {}) => {
  const queryKey = ['search', 'filter-options', options.currentFilters];

  const { data, isLoading, error } = useQuery<FilterOptions>({
    queryKey,
    queryFn: () => searchService.getFilterOptions(options.currentFilters),
    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return {
    filterOptions: data,
    isLoading,
    error,
  };
};
