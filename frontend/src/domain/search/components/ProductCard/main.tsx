import { Eye } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardFooter } from '@/core/components/card';
import { cn } from '@/core/lib/utils';
import { formatPrice } from '../../utils/filterUtils';
import type { ProductCardProps } from './types';

function ProductCard({ product, viewMode, className }: ProductCardProps) {
  if (viewMode === 'lista') {
    return (
      <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="mb-1 line-clamp-1 text-lg font-semibold">{product.name}</h3>
              <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-secondary rounded-full px-2 py-1 text-xs">
                  {product.category}
                </span>
                {product.material && (
                  <span className="bg-secondary rounded-full px-2 py-1 text-xs">
                    {product.material}
                  </span>
                )}
                {product.color && (
                  <span className="bg-secondary rounded-full px-2 py-1 text-xs">
                    {product.color}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-primary text-2xl font-bold">{formatPrice(product.price)}</p>
              <Button size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{product.name}</h3>
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{product.description}</p>
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="bg-secondary rounded-full px-2 py-1 text-xs">{product.category}</span>
          {product.material && (
            <span className="bg-secondary rounded-full px-2 py-1 text-xs">{product.material}</span>
          )}
        </div>
        <p className="text-primary text-2xl font-bold">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2" variant="outline">
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
