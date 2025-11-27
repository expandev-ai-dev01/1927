import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services';

export const useSuggestions = (partialTerm: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['search', 'suggestions', partialTerm],
    queryFn: () => searchService.getSuggestions(partialTerm),
    enabled: partialTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    suggestions: data ?? [],
    isLoading,
  };
};
