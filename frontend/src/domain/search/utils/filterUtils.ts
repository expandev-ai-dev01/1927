import type { SearchFilters, AppliedFilter } from '../types/search';

export const getAppliedFilters = (filters: SearchFilters): AppliedFilter[] => {
  const applied: AppliedFilter[] = [];

  if (filters.categories?.length) {
    filters.categories.forEach((cat) => {
      applied.push({ type: 'category', label: 'Categoria', value: cat });
    });
  }

  if (filters.priceMin !== undefined && filters.priceMin !== null) {
    applied.push({
      type: 'price',
      label: 'Preço mínimo',
      value: `R$ ${filters.priceMin.toFixed(2)}`,
    });
  }

  if (filters.priceMax !== undefined && filters.priceMax !== null) {
    applied.push({
      type: 'price',
      label: 'Preço máximo',
      value: `R$ ${filters.priceMax.toFixed(2)}`,
    });
  }

  if (filters.materials?.length) {
    filters.materials.forEach((mat) => {
      applied.push({ type: 'material', label: 'Material', value: mat });
    });
  }

  if (filters.colors?.length) {
    filters.colors.forEach((color) => {
      applied.push({ type: 'color', label: 'Cor', value: color });
    });
  }

  if (filters.styles?.length) {
    filters.styles.forEach((style) => {
      applied.push({ type: 'style', label: 'Estilo', value: style });
    });
  }

  if (
    filters.heightMin !== undefined &&
    filters.heightMin !== null &&
    filters.heightMax !== undefined &&
    filters.heightMax !== null
  ) {
    applied.push({
      type: 'dimensions',
      label: 'Altura',
      value: `${filters.heightMin}cm - ${filters.heightMax}cm`,
    });
  }

  if (
    filters.widthMin !== undefined &&
    filters.widthMin !== null &&
    filters.widthMax !== undefined &&
    filters.widthMax !== null
  ) {
    applied.push({
      type: 'dimensions',
      label: 'Largura',
      value: `${filters.widthMin}cm - ${filters.widthMax}cm`,
    });
  }

  if (
    filters.depthMin !== undefined &&
    filters.depthMin !== null &&
    filters.depthMax !== undefined &&
    filters.depthMax !== null
  ) {
    applied.push({
      type: 'dimensions',
      label: 'Profundidade',
      value: `${filters.depthMin}cm - ${filters.depthMax}cm`,
    });
  }

  return applied;
};

export const buildShareableUrl = (
  searchTerm: string,
  filters: SearchFilters,
  sortBy: string
): string => {
  const params = new URLSearchParams();

  if (searchTerm) params.append('q', searchTerm);
  if (sortBy && sortBy !== 'relevancia') params.append('sort', sortBy);

  if (filters.categories?.length) {
    params.append('categories', filters.categories.join(','));
  }
  if (filters.priceMin !== undefined && filters.priceMin !== null) {
    params.append('priceMin', filters.priceMin.toString());
  }
  if (filters.priceMax !== undefined && filters.priceMax !== null) {
    params.append('priceMax', filters.priceMax.toString());
  }
  if (filters.materials?.length) {
    params.append('materials', filters.materials.join(','));
  }
  if (filters.colors?.length) {
    params.append('colors', filters.colors.join(','));
  }
  if (filters.styles?.length) {
    params.append('styles', filters.styles.join(','));
  }

  return `${window.location.origin}/search?${params.toString()}`;
};
