import { X } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import { getAppliedFilters } from '../../utils/filterUtils';
import type { AppliedFiltersProps } from './types';

function AppliedFilters({ filters, onRemoveFilter, onClearAll, className }: AppliedFiltersProps) {
  const appliedFilters = getAppliedFilters(filters);

  if (appliedFilters.length === 0) return null;

  const handleRemove = (filter: (typeof appliedFilters)[0]) => {
    const newFilters = { ...filters };

    switch (filter.type) {
      case 'category':
        newFilters.categories = newFilters.categories?.filter((c) => c !== filter.value);
        if (newFilters.categories?.length === 0) delete newFilters.categories;
        break;
      case 'material':
        newFilters.materials = newFilters.materials?.filter((m) => m !== filter.value);
        if (newFilters.materials?.length === 0) delete newFilters.materials;
        break;
      case 'color':
        newFilters.colors = newFilters.colors?.filter((c) => c !== filter.value);
        if (newFilters.colors?.length === 0) delete newFilters.colors;
        break;
      case 'style':
        newFilters.styles = newFilters.styles?.filter((s) => s !== filter.value);
        if (newFilters.styles?.length === 0) delete newFilters.styles;
        break;
      case 'price':
        if (filter.label.includes('mínimo')) {
          delete newFilters.priceMin;
        } else {
          delete newFilters.priceMax;
        }
        break;
      case 'dimension':
        if (newFilters.dimensions) {
          if (filter.label.includes('Altura mínima')) delete newFilters.dimensions.heightMin;
          if (filter.label.includes('Altura máxima')) delete newFilters.dimensions.heightMax;
          if (filter.label.includes('Largura mínima')) delete newFilters.dimensions.widthMin;
          if (filter.label.includes('Largura máxima')) delete newFilters.dimensions.widthMax;
          if (filter.label.includes('Profundidade mínima')) delete newFilters.dimensions.depthMin;
          if (filter.label.includes('Profundidade máxima')) delete newFilters.dimensions.depthMax;
        }
        break;
    }

    onRemoveFilter(newFilters);
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-muted-foreground text-sm font-medium">Filtros aplicados:</span>
      {appliedFilters.map((filter, index) => (
        <Badge key={index} variant="secondary" className="gap-1 pr-1">
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <button
            type="button"
            onClick={() => handleRemove(filter)}
            className="hover:bg-secondary-foreground/20 ml-1 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs">
        Limpar todos
      </Button>
    </div>
  );
}

export { AppliedFilters };
