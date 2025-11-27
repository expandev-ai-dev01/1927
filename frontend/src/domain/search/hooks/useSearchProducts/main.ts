import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';
import type { SearchParams, SearchResult } from '../../types/search';

export interface UseSearchProductsOptions {
  params: SearchParams;
  enabled?: boolean;
}

export const useSearchProducts = (options: UseSearchProductsOptions) => {
  const queryKey = ['search', 'products', options.params];

  const { data, isLoading, error, refetch } = useQuery<SearchResult>({
    queryKey,
    queryFn: () => searchService.searchProducts(options.params),
    enabled: options.enabled !== false,
  });

  return {
    products: data?.products ?? [],
    totalResults: data?.totalResults ?? 0,
    pageNumber: data?.pageNumber ?? 1,
    pageSize: data?.pageSize ?? 24,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    refetch,
  };
};
