import type { SearchFilters } from '../../types/search';

export interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}
