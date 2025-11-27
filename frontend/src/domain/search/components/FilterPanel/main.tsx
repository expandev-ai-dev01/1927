import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';
import { Slider } from '@/core/components/slider';
import { cn } from '@/core/lib/utils';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import type { FilterPanelProps } from './types';

function FilterPanel({ filters, onFiltersChange, className }: FilterPanelProps) {
  const { filterOptions, isLoading } = useFilterOptions();
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
    const newCategories = checked
      ? [...(filters.categories || []), category]
      : (filters.categories || []).filter((c) => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const newMaterials = checked
      ? [...(filters.materials || []), material]
      : (filters.materials || []).filter((m) => m !== material);
    onFiltersChange({ ...filters, materials: newMaterials });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...(filters.colors || []), color]
      : (filters.colors || []).filter((c) => c !== color);
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const newStyles = checked
      ? [...(filters.styles || []), style]
      : (filters.styles || []).filter((s) => s !== style);
    onFiltersChange({ ...filters, styles: newStyles });
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
      <div className={cn('bg-card rounded-lg border p-6 shadow-sm', className)}>
        <div className="animate-pulse space-y-4">
          <div className="bg-muted h-6 w-32 rounded" />
          <div className="space-y-2">
            <div className="bg-muted h-4 w-full rounded" />
            <div className="bg-muted h-4 w-full rounded" />
            <div className="bg-muted h-4 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!filterOptions) return null;

  return (
    <div className={cn('bg-card rounded-lg border shadow-sm', className)}>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Limpar
        </Button>
      </div>

      <div className="divide-y">
        {/* Categories */}
        <div className="p-4">
          <button
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
            <div className="mt-3 space-y-2">
              {filterOptions.categories.map((cat) => (
                <div key={cat.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat.name}`}
                    checked={filters.categories?.includes(cat.name)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(cat.name, checked as boolean)
                    }
                  />
                  <Label htmlFor={`cat-${cat.name}`} className="flex-1 cursor-pointer text-sm">
                    {cat.name}
                    <span className="text-muted-foreground ml-1 text-xs">({cat.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>Faixa de Preço</span>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.price && (
            <div className="mt-4 space-y-4">
              <Slider
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                step={10}
                value={[
                  filters.priceMin ?? filterOptions.priceRange.min,
                  filters.priceMax ?? filterOptions.priceRange.max,
                ]}
                onValueChange={handlePriceChange}
              />
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>R$ {(filters.priceMin ?? filterOptions.priceRange.min).toFixed(2)}</span>
                <span>R$ {(filters.priceMax ?? filterOptions.priceRange.max).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Materials */}
        <div className="p-4">
          <button
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
            <div className="mt-3 space-y-2">
              {filterOptions.materials.map((mat) => (
                <div key={mat.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mat-${mat.name}`}
                    checked={filters.materials?.includes(mat.name)}
                    onCheckedChange={(checked) =>
                      handleMaterialChange(mat.name, checked as boolean)
                    }
                  />
                  <Label htmlFor={`mat-${mat.name}`} className="flex-1 cursor-pointer text-sm">
                    {mat.name}
                    <span className="text-muted-foreground ml-1 text-xs">({mat.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="p-4">
          <button
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
            <div className="mt-3 space-y-2">
              {filterOptions.colors.map((color) => (
                <div key={color.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color.name}`}
                    checked={filters.colors?.includes(color.name)}
                    onCheckedChange={(checked) => handleColorChange(color.name, checked as boolean)}
                  />
                  <Label htmlFor={`color-${color.name}`} className="flex-1 cursor-pointer text-sm">
                    {color.name}
                    <span className="text-muted-foreground ml-1 text-xs">({color.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Styles */}
        <div className="p-4">
          <button
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
            <div className="mt-3 space-y-2">
              {filterOptions.styles.map((style) => (
                <div key={style.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`style-${style.name}`}
                    checked={filters.styles?.includes(style.name)}
                    onCheckedChange={(checked) => handleStyleChange(style.name, checked as boolean)}
                  />
                  <Label htmlFor={`style-${style.name}`} className="flex-1 cursor-pointer text-sm">
                    {style.name}
                    <span className="text-muted-foreground ml-1 text-xs">({style.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { FilterPanel };
