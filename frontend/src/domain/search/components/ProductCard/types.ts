import type { Product } from '../../types/search';

export interface ProductCardProps {
  product: Product;
  viewMode?: 'grade' | 'lista';
  className?: string;
}
