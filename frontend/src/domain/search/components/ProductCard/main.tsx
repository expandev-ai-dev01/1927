import { Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { useNavigation } from '@/core/hooks/useNavigation';
import { cn } from '@/core/lib/utils';
import type { ProductCardProps } from './types';

function ProductCard({ product, className }: ProductCardProps) {
  const { navigate } = useNavigation();

  const handleViewDetails = () => {
    navigate(`/produtos/${product.id}`);
  };

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
      <div className="bg-muted relative aspect-square overflow-hidden">
        <img
          src={product.imagem_principal}
          alt={product.nome}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {product.categoria && (
          <Badge variant="secondary" className="absolute left-2 top-2">
            {product.categoria}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{product.nome}</h3>
        <p className="text-muted-foreground mb-2 text-xs">{product.codigo}</p>
        <p className="text-primary text-2xl font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(product.preco)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleViewDetails} className="w-full" variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
