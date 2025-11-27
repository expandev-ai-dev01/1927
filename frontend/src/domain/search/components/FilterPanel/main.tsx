import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';
import { Slider } from '@/core/components/slider';
import { cn } from '@/core/lib/utils';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { formatPrice } from '../../utils/filterUtils';
import type { FilterPanelProps } from './types';

function FilterPanel({ filters, onFiltersChange, className }: FilterPanelProps) {
  const { filterOptions, isLoading } = useFilterOptions({ currentFilters: filters });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    materials: false,
    colors: false,
    styles: false,
    dimensions: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const current = filters.categories ?? [];
    const updated = checked ? [...current, category] : current.filter((c) => c !== category);
    onFiltersChange({ ...filters, categories: updated.length > 0 ? updated : undefined });
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const current = filters.materials ?? [];
    const updated = checked ? [...current, material] : current.filter((m) => m !== material);
    onFiltersChange({ ...filters, materials: updated.length > 0 ? updated : undefined });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const current = filters.colors ?? [];
    const updated = checked ? [...current, color] : current.filter((c) => c !== color);
    onFiltersChange({ ...filters, colors: updated.length > 0 ? updated : undefined });
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const current = filters.styles ?? [];
    const updated = checked ? [...current, style] : current.filter((s) => s !== style);
    onFiltersChange({ ...filters, styles: updated.length > 0 ? updated : undefined });
  };

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      priceMin: values[0],
      priceMax: values[1],
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  if (isLoading) {
    return (
      <div className={cn('bg-card space-y-4 rounded-lg border p-6 shadow-sm', className)}>
        <div className="flex items-center justify-center py-8">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!filterOptions) return null;

  const hasActiveFilters =
    (filters.categories?.length ?? 0) > 0 ||
    (filters.materials?.length ?? 0) > 0 ||
    (filters.colors?.length ?? 0) > 0 ||
    (filters.styles?.length ?? 0) > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined;

  return (
    <div className={cn('bg-card space-y-4 rounded-lg border p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 text-xs">
            <X className="mr-1 h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3 border-t pt-4">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Categorias</span>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            {filterOptions.categories.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${option.value}`}
                  checked={filters.categories?.includes(option.value) ?? false}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(option.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`cat-${option.value}`}
                  className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                >
                  <span>{option.label}</span>
                  <span className="text-muted-foreground text-xs">({option.count})</span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3 border-t pt-4">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Preço</span>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <Slider
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
              step={10}
              value={[
                filters.priceMin ?? filterOptions.priceRange.min,
                filters.priceMax ?? filterOptions.priceRange.max,
              ]}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{formatPrice(filters.priceMin ?? filterOptions.priceRange.min)}</span>
              <span>{formatPrice(filters.priceMax ?? filterOptions.priceRange.max)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Materials */}
      {filterOptions.materials.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <button
            type="button"
            onClick={() => toggleSection('materials')}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>Materiais</span>
            {expandedSections.materials ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.materials && (
            <div className="space-y-2">
              {filterOptions.materials.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mat-${option.value}`}
                    checked={filters.materials?.includes(option.value) ?? false}
                    onCheckedChange={(checked) =>
                      handleMaterialChange(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`mat-${option.value}`}
                    className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                  >
                    <span>{option.label}</span>
                    <span className="text-muted-foreground text-xs">({option.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colors */}
      {filterOptions.colors.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <button
            type="button"
            onClick={() => toggleSection('colors')}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>Cores</span>
            {expandedSections.colors ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.colors && (
            <div className="space-y-2">
              {filterOptions.colors.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${option.value}`}
                    checked={filters.colors?.includes(option.value) ?? false}
                    onCheckedChange={(checked) =>
                      handleColorChange(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`col-${option.value}`}
                    className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                  >
                    <span>{option.label}</span>
                    <span className="text-muted-foreground text-xs">({option.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      {filterOptions.styles.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <button
            type="button"
            onClick={() => toggleSection('styles')}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>Estilos</span>
            {expandedSections.styles ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.styles && (
            <div className="space-y-2">
              {filterOptions.styles.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sty-${option.value}`}
                    checked={filters.styles?.includes(option.value) ?? false}
                    onCheckedChange={(checked) =>
                      handleStyleChange(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`sty-${option.value}`}
                    className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                  >
                    <span>{option.label}</span>
                    <span className="text-muted-foreground text-xs">({option.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { FilterPanel };
