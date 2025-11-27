import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/core/components/pagination';
import { SearchBar, FilterPanel, ProductGrid, AppliedFilters } from '@/domain/search/components';
import { useSearchProducts } from '@/domain/search/hooks/useSearchProducts';
import { useSearchStore } from '@/domain/search/stores/searchStore';
import type { SearchFilters } from '@/domain/search/types/search';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    searchTerm,
    filters,
    sortBy,
    viewMode,
    pageSize,
    setSearchTerm,
    setFilters,
    setSortBy,
    setViewMode,
    setPageSize,
    clearFilters,
  } = useSearchStore();

  // Initialize from URL params
  useEffect(() => {
    const term = searchParams.get('q');
    const page = searchParams.get('page');
    const sort = searchParams.get('sort');

    if (term && term !== searchTerm) setSearchTerm(term);
    if (page) setCurrentPage(parseInt(page, 10));
    if (sort && sort !== sortBy) {
      setSortBy(
        sort as
          | 'relevancia'
          | 'nome_asc'
          | 'nome_desc'
          | 'preco_asc'
          | 'preco_desc'
          | 'data_cadastro_desc'
      );
    }
  }, [searchParams]);

  const { products, totalResults, totalPages, isLoading } = useSearchProducts({
    params: {
      searchTerm: searchTerm || undefined,
      filters,
      sortBy,
      pageNumber: currentPage,
      pageSize,
    },
    enabled: searchTerm.length >= 2 || Object.keys(filters).length > 0,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.set('q', term);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(
      value as
        | 'relevancia'
        | 'nome_asc'
        | 'nome_desc'
        | 'preco_asc'
        | 'preco_desc'
        | 'data_cadastro_desc'
    );
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value, 10) as 12 | 24 | 36 | 48);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Search Bar */}
      <div className="mx-auto max-w-3xl">
        <SearchBar value={searchTerm} onChange={setSearchTerm} onSearch={handleSearch} />
      </div>

      {/* Applied Filters */}
      {Object.keys(filters).length > 0 && (
        <AppliedFilters
          filters={filters}
          onRemoveFilter={handleFiltersChange}
          onClearAll={handleClearFilters}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-4">
          <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} />
        </aside>

        {/* Results */}
        <main className="space-y-6">
          {/* Controls */}
          <div className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
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

              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 itens</SelectItem>
                  <SelectItem value="24">24 itens</SelectItem>
                  <SelectItem value="36">36 itens</SelectItem>
                  <SelectItem value="48">48 itens</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isLoading && totalResults > 0 && (
              <p className="text-muted-foreground text-sm">
                Mostrando {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, totalResults)} de {totalResults} resultados
              </p>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {renderPagination()}
        </main>
      </div>
    </div>
  );
}

export { SearchPage };
