import { Search } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Card } from '@/core/components/card';
import { ProductCard } from '../ProductCard';
import { useSearchStore } from '../../stores/searchStore';
import { cn } from '@/core/lib/utils';
import type { EmptyStateProps } from './types';

function EmptyState({ suggestions, relatedProducts, className }: EmptyStateProps) {
  const { searchTerm, setSearchTerm, clearFilters } = useSearchStore();

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    clearFilters();
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Empty State Message */}
      <Card className="p-12 text-center">
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Search className="text-muted-foreground h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">
          Nenhum produto encontrado
          {searchTerm && (
            <>
              {' '}
              para <span className="text-primary">"{searchTerm}"</span>
            </>
          )}
        </h2>
        <p className="text-muted-foreground mb-6">
          Tente ajustar seus filtros ou buscar por outros termos
        </p>
        <Button onClick={handleClearAll} variant="outline">
          Limpar busca e filtros
        </Button>
      </Card>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Você quis dizer:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Produtos que podem te interessar:</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { EmptyState };
