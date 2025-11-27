import type { Product } from '../../types/search';

export interface ProductGridProps {
  products: Product[];
  viewMode: 'grade' | 'lista';
  onViewModeChange?: (mode: 'grade' | 'lista') => void;
  isLoading?: boolean;
  className?: string;
}
