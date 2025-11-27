import { X } from 'lucide-react';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { getAppliedFilters } from '../../utils/filterUtils';
import type { FilterBreadcrumbProps } from './types';

function FilterBreadcrumb({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}: FilterBreadcrumbProps) {
  const appliedFilters = getAppliedFilters(filters);

  if (appliedFilters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-muted-foreground text-sm font-medium">Filtros aplicados:</span>
      {appliedFilters.map((filter, index) => (
        <div
          key={index}
          className="bg-secondary flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => onRemoveFilter?.(filter)}
            className="hover:bg-destructive/10 ml-1 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs">
        Limpar todos
      </Button>
    </div>
  );
}

export { FilterBreadcrumb };
