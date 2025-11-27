import type { SearchResult } from '../../types';

export interface EmptyStateProps {
  suggestions?: string[];
  relatedProducts?: SearchResult[];
  className?: string;
}
