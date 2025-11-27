import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  SearchBar,
  FilterPanel,
  ProductGrid,
  AppliedFilters,
  SearchPagination,
} from '@/domain/search/components';
import { useSearch } from '@/domain/search/hooks';
import { useSearchStore } from '@/domain/search/stores';

function SearchPage() {
  const { searchTerm, filters, sortBy, page, pageSize } = useSearchStore();
  const { products, totalCount, totalPages, isLoading, recordHistory } = useSearch({
    searchTerm,
    filters,
    sortBy,
    page,
    pageSize,
  });

  useEffect(() => {
    if (searchTerm && !isLoading && products) {
      recordHistory({
        searchTerm,
        filters: JSON.stringify(filters),
        resultCount: totalCount,
      });
    }
  }, [searchTerm, filters, isLoading, products, totalCount, recordHistory]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Buscar Móveis</h1>
          <p className="text-muted-foreground">Encontre o móvel perfeito para seu espaço</p>
        </div>

        <div className="mb-8">
          <SearchBar />
        </div>

        {searchTerm && (
          <div className="mb-6">
            <AppliedFilters />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <FilterPanel />
            </div>
          </aside>

          <main>
            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
                  <p className="text-muted-foreground text-sm">Buscando produtos...</p>
                </div>
              </div>
            ) : (
              <>
                <ProductGrid products={products} />
                {totalPages > 1 && <SearchPagination totalPages={totalPages} />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export { SearchPage };
