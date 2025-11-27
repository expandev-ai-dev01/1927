import { Grid, List } from 'lucide-react';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { useSearchStore } from '../../stores';
import { ProductCard } from '../ProductCard';
import type { ProductGridProps } from './types';

function ProductGrid({ products, className }: ProductGridProps) {
  const { viewMode, setViewMode } = useSearchStore();

  if (!products || products.length === 0) {
    return (
      <div className="bg-muted/20 flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground text-sm">
            Tente ajustar seus filtros ou termo de busca
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grade' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grade')}
            className="h-9 w-9"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('lista')}
            className="h-9 w-9"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grade' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grade" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="lista" />
          ))}
        </div>
      )}
    </div>
  );
}

export { ProductGrid };
