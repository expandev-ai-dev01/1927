import type { SearchFilters, AppliedFilter } from '../types/search';

export const getAppliedFilters = (filters: SearchFilters): AppliedFilter[] => {
  const applied: AppliedFilter[] = [];

  if (filters.categories?.length) {
    filters.categories.forEach((cat) => {
      applied.push({
        type: 'category',
        label: 'Categoria',
        value: cat,
      });
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
      applied.push({
        type: 'material',
        label: 'Material',
        value: mat,
      });
    });
  }

  if (filters.colors?.length) {
    filters.colors.forEach((color) => {
      applied.push({
        type: 'color',
        label: 'Cor',
        value: color,
      });
    });
  }

  if (filters.styles?.length) {
    filters.styles.forEach((style) => {
      applied.push({
        type: 'style',
        label: 'Estilo',
        value: style,
      });
    });
  }

  if (filters.dimensions) {
    const dims = filters.dimensions;
    if (dims.heightMin !== undefined && dims.heightMin !== null) {
      applied.push({
        type: 'dimension',
        label: 'Altura mínima',
        value: `${dims.heightMin} cm`,
      });
    }
    if (dims.heightMax !== undefined && dims.heightMax !== null) {
      applied.push({
        type: 'dimension',
        label: 'Altura máxima',
        value: `${dims.heightMax} cm`,
      });
    }
    if (dims.widthMin !== undefined && dims.widthMin !== null) {
      applied.push({
        type: 'dimension',
        label: 'Largura mínima',
        value: `${dims.widthMin} cm`,
      });
    }
    if (dims.widthMax !== undefined && dims.widthMax !== null) {
      applied.push({
        type: 'dimension',
        label: 'Largura máxima',
        value: `${dims.widthMax} cm`,
      });
    }
    if (dims.depthMin !== undefined && dims.depthMin !== null) {
      applied.push({
        type: 'dimension',
        label: 'Profundidade mínima',
        value: `${dims.depthMin} cm`,
      });
    }
    if (dims.depthMax !== undefined && dims.depthMax !== null) {
      applied.push({
        type: 'dimension',
        label: 'Profundidade máxima',
        value: `${dims.depthMax} cm`,
      });
    }
  }

  return applied;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};
