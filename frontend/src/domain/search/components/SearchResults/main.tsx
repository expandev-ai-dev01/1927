import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/core/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Skeleton } from '@/core/components/skeleton';
import { useSearchStore } from '../../stores/searchStore';
import { useSearch } from '../../hooks/useSearch';
import { ProductCard } from '../ProductCard';
import { cn } from '@/core/lib/utils';
import type { SearchResultsProps } from './types';

function SearchResults({ className }: SearchResultsProps) {
  const {
    viewMode,
    sortBy,
    pageSize,
    currentPage,
    setViewMode,
    setSortBy,
    setPageSize,
    setCurrentPage,
  } = useSearchStore();

  const { searchResult, isLoading } = useSearch();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!searchResult || searchResult.totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(searchResult.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button variant="outline" onClick={() => handlePageChange(1)}>
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < searchResult.totalPages && (
          <>
            {endPage < searchResult.totalPages - 1 && <span className="px-2">...</span>}
            <Button variant="outline" onClick={() => handlePageChange(searchResult.totalPages)}>
              {searchResult.totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === searchResult.totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controls Bar */}
      <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            {searchResult ? (
              <>
                <span className="text-foreground font-semibold">{searchResult.totalResults}</span>{' '}
                {searchResult.totalResults === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </>
            ) : (
              'Carregando...'
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancia">Relevância</SelectItem>
              <SelectItem value="nome_asc">Nome (A-Z)</SelectItem>
              <SelectItem value="nome_desc">Nome (Z-A)</SelectItem>
              <SelectItem value="preco_asc">Menor Preço</SelectItem>
              <SelectItem value="preco_desc">Maior Preço</SelectItem>
              <SelectItem value="data_cadastro_desc">Mais Recentes</SelectItem>
            </SelectContent>
          </Select>

          {/* Items per page */}
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value) as 12 | 24 | 36 | 48)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 itens</SelectItem>
              <SelectItem value="24">24 itens</SelectItem>
              <SelectItem value="36">36 itens</SelectItem>
              <SelectItem value="48">48 itens</SelectItem>
            </SelectContent>
          </Select>

          {/* View mode */}
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'grade' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grade')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'lista' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('lista')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div
          className={cn(
            viewMode === 'grade'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'space-y-4'
          )}
        >
          {Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className={cn('bg-card rounded-lg border p-4', viewMode === 'lista' && 'flex gap-4')}
            >
              <Skeleton className={cn('h-48 w-full', viewMode === 'lista' && 'h-32 w-32')} />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : searchResult && searchResult.products.length > 0 ? (
        <>
          <div
            className={cn(
              viewMode === 'grade'
                ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
            )}
          >
            {searchResult.products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">{renderPagination()}</div>
        </>
      ) : (
        <div className="bg-card flex min-h-[400px] flex-col items-center justify-center rounded-lg border p-12 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar seus filtros ou realizar uma nova busca
          </p>
        </div>
      )}
    </div>
  );
}

export { SearchResults };
