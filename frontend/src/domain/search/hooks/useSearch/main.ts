import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchService } from '../../services';
import type { SearchParams } from '../../types';

export const useSearch = (params: SearchParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['search', 'products', params];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => searchService.searchProducts(params),
    enabled: !!params.searchTerm || !!params.productCode || !!params.filters,
  });

  const { mutateAsync: recordHistory } = useMutation({
    mutationFn: (historyParams: { searchTerm: string; filters?: string; resultCount: number }) =>
      searchService.createHistory(historyParams),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
    },
  });

  return {
    products: data?.products ?? [],
    totalCount: data?.totalCount ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 24,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    refetch,
    recordHistory,
  };
};
