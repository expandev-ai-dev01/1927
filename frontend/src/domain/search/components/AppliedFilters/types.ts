import type { SearchFilters } from '../../types/search';

export interface AppliedFiltersProps {
  filters: SearchFilters;
  onRemoveFilter: (filters: SearchFilters) => void;
  onClearAll: () => void;
  className?: string;
}
