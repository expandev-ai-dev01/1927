import { Card, CardContent, CardFooter, CardHeader } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import type { ProductCardProps } from './types';

function ProductCard({ product, viewMode, className }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (viewMode === 'lista') {
    return (
      <Card className={cn('transition-all hover:shadow-md', className)}>
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-md sm:h-40 sm:w-40">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.code}</p>
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {product.description}
              </p>
              <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                <span>Material: {product.material}</span>
                <span>•</span>
                <span>Cor: {product.color}</span>
                <span>•</span>
                <span>Estilo: {product.style}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-primary text-2xl font-bold">{formatPrice(product.price)}</p>
              <Button size="sm">Ver Detalhes</Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute right-2 top-2">{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-1 font-semibold">{product.name}</h3>
        <p className="text-muted-foreground mb-2 text-xs">{product.code}</p>
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{product.description}</p>
        <div className="text-muted-foreground space-y-1 text-xs">
          <p>Material: {product.material}</p>
          <p>Cor: {product.color}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-primary text-xl font-bold">{formatPrice(product.price)}</p>
        <Button size="sm">Ver</Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
