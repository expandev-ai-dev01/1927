import { Eye } from 'lucide-react';
import { Card } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { useNavigation } from '@/core/hooks/useNavigation';
import { cn } from '@/core/lib/utils';
import type { ProductListItemProps } from './types';

function ProductListItem({ product, className }: ProductListItemProps) {
  const { navigate } = useNavigation();

  const handleViewDetails = () => {
    navigate(`/produtos/${product.id}`);
  };

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-md', className)}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        {/* Image */}
        <div className="bg-muted relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32">
          <img
            src={product.imagem_principal}
            alt={product.nome}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{product.nome}</h3>
                <p className="text-muted-foreground text-sm">{product.codigo}</p>
              </div>
              {product.categoria && <Badge variant="secondary">{product.categoria}</Badge>}
            </div>
            <p className="text-muted-foreground line-clamp-2 text-sm">{product.descricao}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-primary text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(product.preco)}
            </p>
            <Button onClick={handleViewDetails} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ProductListItem };
