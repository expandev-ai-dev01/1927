import { Grid, List } from 'lucide-react';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { ProductCard } from '../ProductCard';
import type { ProductGridProps } from './types';

function ProductGrid({
  products,
  viewMode,
  onViewModeChange,
  isLoading,
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div className="bg-muted h-6 w-32 animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="bg-muted h-10 w-10 animate-pulse rounded" />
            <div className="bg-muted h-10 w-10 animate-pulse rounded" />
          </div>
        </div>
        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grade'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-96 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn('bg-card rounded-lg border p-12 text-center shadow-sm', className)}>
        <div className="mx-auto max-w-md space-y-4">
          <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Grid className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground text-sm">
            Tente ajustar seus filtros ou realizar uma nova busca
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {products.length} produto{products.length !== 1 ? 's' : ''} encontrado
          {products.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grade' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange?.('grade')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange?.('lista')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'grid gap-6',
          viewMode === 'grade'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}

export { ProductGrid };
