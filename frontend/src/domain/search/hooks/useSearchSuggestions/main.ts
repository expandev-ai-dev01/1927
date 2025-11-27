import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';

export const useSearchSuggestions = (partialTerm: string, enabled: boolean = true) => {
  const { data, isLoading } = useQuery({
    queryKey: ['searchSuggestions', partialTerm],
    queryFn: () => searchService.getSuggestions(partialTerm, 10),
    enabled: enabled && partialTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    suggestions: data || [],
    isLoading,
  };
};
