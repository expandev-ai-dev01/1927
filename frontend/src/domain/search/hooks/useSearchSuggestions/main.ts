import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';
import type { SearchSuggestion } from '../../types/search';

export interface UseSearchSuggestionsOptions {
  partialTerm: string;
  maxSuggestions?: number;
  enabled?: boolean;
}

export const useSearchSuggestions = (options: UseSearchSuggestionsOptions) => {
  const queryKey = ['search', 'suggestions', options.partialTerm, options.maxSuggestions];

  const { data, isLoading } = useQuery<SearchSuggestion[]>({
    queryKey,
    queryFn: () => searchService.getSuggestions(options.partialTerm, options.maxSuggestions),
    enabled: options.enabled !== false && options.partialTerm.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return {
    suggestions: data ?? [],
    isLoading,
  };
};
