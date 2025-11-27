import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';

export const useSuggestions = (partialTerm: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['suggestions', partialTerm],
    queryFn: () => searchService.getSuggestions(partialTerm),
    enabled: partialTerm.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return {
    suggestions: data || [],
    isLoading,
  };
};
