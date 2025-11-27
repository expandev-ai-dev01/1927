import type { SearchFilters, AppliedFilter } from '../types/search';

export const getAppliedFilters = (filters: SearchFilters): AppliedFilter[] => {
  const applied: AppliedFilter[] = [];

  if (filters.categories?.length) {
    filters.categories.forEach((category) => {
      applied.push({
        type: 'category',
        label: 'Categoria',
        value: category,
        displayValue: category,
      });
    });
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const min = filters.priceMin ?? 0;
    const max = filters.priceMax ?? 'sem limite';
    applied.push({
      type: 'price',
      label: 'Preço',
      value: `${min}-${max}`,
      displayValue: `R$ ${min} - ${max === 'sem limite' ? max : `R$ ${max}`}`,
    });
  }

  if (filters.materials?.length) {
    filters.materials.forEach((material) => {
      applied.push({
        type: 'material',
        label: 'Material',
        value: material,
        displayValue: material,
      });
    });
  }

  if (filters.colors?.length) {
    filters.colors.forEach((color) => {
      applied.push({
        type: 'color',
        label: 'Cor',
        value: color,
        displayValue: color,
      });
    });
  }

  if (filters.styles?.length) {
    filters.styles.forEach((style) => {
      applied.push({
        type: 'style',
        label: 'Estilo',
        value: style,
        displayValue: style,
      });
    });
  }

  if (filters.dimensions) {
    const { heightMin, heightMax, widthMin, widthMax, depthMin, depthMax } = filters.dimensions;

    if (heightMin !== undefined || heightMax !== undefined) {
      applied.push({
        type: 'dimension',
        label: 'Altura',
        value: `${heightMin ?? 0}-${heightMax ?? 'sem limite'}`,
        displayValue: `${heightMin ?? 0}cm - ${heightMax ?? 'sem limite'}`,
      });
    }

    if (widthMin !== undefined || widthMax !== undefined) {
      applied.push({
        type: 'dimension',
        label: 'Largura',
        value: `${widthMin ?? 0}-${widthMax ?? 'sem limite'}`,
        displayValue: `${widthMin ?? 0}cm - ${widthMax ?? 'sem limite'}`,
      });
    }

    if (depthMin !== undefined || depthMax !== undefined) {
      applied.push({
        type: 'dimension',
        label: 'Profundidade',
        value: `${depthMin ?? 0}-${depthMax ?? 'sem limite'}`,
        displayValue: `${depthMin ?? 0}cm - ${depthMax ?? 'sem limite'}`,
      });
    }
  }

  return applied;
};

export const serializeFilters = (filters: SearchFilters): string => {
  return JSON.stringify(filters);
};

export const deserializeFilters = (filtersString: string): SearchFilters => {
  try {
    return JSON.parse(filtersString);
  } catch {
    return {};
  }
};
