import type { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  viewMode: 'grade' | 'lista';
  className?: string;
}
