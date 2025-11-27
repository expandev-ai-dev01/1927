import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';

export const useAutocomplete = (term: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['autocomplete', term],
    queryFn: () => searchService.getAutocompleteSuggestions(term),
    enabled: term.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    suggestions: data || [],
    isLoading,
  };
};
