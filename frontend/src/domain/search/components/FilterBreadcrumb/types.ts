import type { SearchFilters, AppliedFilter } from '../../types/search';

export interface FilterBreadcrumbProps {
  filters: SearchFilters;
  onRemoveFilter?: (filter: AppliedFilter) => void;
  onClearAll?: () => void;
  className?: string;
}
