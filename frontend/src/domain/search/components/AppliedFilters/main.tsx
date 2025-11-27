import { X } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import { useSearchStore } from '../../stores';
import type { AppliedFiltersProps } from './types';

function AppliedFilters({ className }: AppliedFiltersProps) {
  const { appliedFilters, removeFilter, clearFilters } = useSearchStore();

  if (appliedFilters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-muted-foreground text-sm font-medium">Filtros aplicados:</span>
      {appliedFilters.map((filter, index) => (
        <Badge
          key={`${filter.type}-${filter.value}-${index}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <button
            onClick={() => removeFilter(filter.type, filter.value)}
            className="hover:bg-muted ml-1 rounded-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {appliedFilters.length > 1 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
          Limpar todos
        </Button>
      )}
    </div>
  );
}

export { AppliedFilters };
