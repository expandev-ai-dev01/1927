import { Card, CardContent, CardFooter } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import type { ProductCardProps } from './types';

function ProductCard({ product, viewMode = 'grade', className }: ProductCardProps) {
  const isGridView = viewMode === 'grade';

  if (isGridView) {
    return (
      <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
        <div className="bg-muted relative aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.category && <Badge className="absolute right-2 top-2">{product.category}</Badge>}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{product.name}</h3>
          {product.description && (
            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{product.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {product.material && <Badge variant="secondary">{product.material}</Badge>}
            {product.color && <Badge variant="secondary">{product.color}</Badge>}
            {product.style && <Badge variant="secondary">{product.style}</Badge>}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div>
            <p className="text-primary text-2xl font-bold">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            {product.code && <p className="text-muted-foreground text-xs">Cód: {product.code}</p>}
          </div>
          <Button size="sm">Ver Detalhes</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
      <div className="flex gap-4 p-4">
        <div className="bg-muted relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              {product.category && <Badge>{product.category}</Badge>}
            </div>
            {product.description && (
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {product.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {product.material && <Badge variant="secondary">{product.material}</Badge>}
              {product.color && <Badge variant="secondary">{product.color}</Badge>}
              {product.style && <Badge variant="secondary">{product.style}</Badge>}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-primary text-2xl font-bold">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              {product.code && <p className="text-muted-foreground text-xs">Cód: {product.code}</p>}
            </div>
            <Button size="sm">Ver Detalhes</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ProductCard };
