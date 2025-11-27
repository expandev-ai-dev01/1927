import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Label } from '@/core/components/label';
import { Checkbox } from '@/core/components/checkbox';
import { Slider } from '@/core/components/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/core/components/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/core/components/collapsible';
import { useSearchStore } from '../../stores/searchStore';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { cn } from '@/core/lib/utils';
import type { SearchFiltersProps } from './types';

function SearchFilters({ className }: SearchFiltersProps) {
  const { filters, updateFilter, clearFilters } = useSearchStore();
  const { filterOptions, isLoading } = useFilterOptions();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    materials: false,
    colors: false,
    styles: false,
    dimensions: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const current = filters.categories || [];
    const updated = checked ? [...current, category] : current.filter((c) => c !== category);
    updateFilter('categories', updated);
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const current = filters.materials || [];
    const updated = checked ? [...current, material] : current.filter((m) => m !== material);
    updateFilter('materials', updated);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const current = filters.colors || [];
    const updated = checked ? [...current, color] : current.filter((c) => c !== color);
    updateFilter('colors', updated);
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const current = filters.styles || [];
    const updated = checked ? [...current, style] : current.filter((s) => s !== style);
    updateFilter('styles', updated);
  };

  const handlePriceChange = (values: number[]) => {
    updateFilter('priceMin', values[0]);
    updateFilter('priceMax', values[1]);
  };

  const hasActiveFilters = () => {
    return (
      (filters.categories?.length ?? 0) > 0 ||
      (filters.materials?.length ?? 0) > 0 ||
      (filters.colors?.length ?? 0) > 0 ||
      (filters.styles?.length ?? 0) > 0 ||
      filters.priceMin !== null ||
      filters.priceMax !== null
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-semibold">Categorias</h3>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', openSections.categories && 'rotate-180')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {isLoading ? (
            <div className="text-muted-foreground text-sm">Carregando...</div>
          ) : (
            filterOptions?.categories?.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={filters.categories?.includes(category.value)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category.value}`}
                  className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
                >
                  <span>{category.label}</span>
                  <span className="text-muted-foreground text-xs">({category.count})</span>
                </Label>
              </div>
            ))
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-semibold">Faixa de Preço</h3>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', openSections.price && 'rotate-180')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-3">
          {filterOptions?.priceRange && (
            <>
              <Slider
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                step={100}
                value={[
                  filters.priceMin ?? filterOptions.priceRange.min,
                  filters.priceMax ?? filterOptions.priceRange.max,
                ]}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>
                  R$ {(filters.priceMin ?? filterOptions.priceRange.min).toLocaleString('pt-BR')}
                </span>
                <span>
                  R$ {(filters.priceMax ?? filterOptions.priceRange.max).toLocaleString('pt-BR')}
                </span>
              </div>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Materials */}
      <Collapsible open={openSections.materials} onOpenChange={() => toggleSection('materials')}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-semibold">Materiais</h3>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', openSections.materials && 'rotate-180')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {filterOptions?.materials?.map((material) => (
            <div key={material.value} className="flex items-center space-x-2">
              <Checkbox
                id={`material-${material.value}`}
                checked={filters.materials?.includes(material.value)}
                onCheckedChange={(checked) =>
                  handleMaterialChange(material.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`material-${material.value}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{material.label}</span>
                <span className="text-muted-foreground text-xs">({material.count})</span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible open={openSections.colors} onOpenChange={() => toggleSection('colors')}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-semibold">Cores</h3>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', openSections.colors && 'rotate-180')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {filterOptions?.colors?.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.value}`}
                checked={filters.colors?.includes(color.value)}
                onCheckedChange={(checked) => handleColorChange(color.value, checked as boolean)}
              />
              <Label
                htmlFor={`color-${color.value}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{color.label}</span>
                <span className="text-muted-foreground text-xs">({color.count})</span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Styles */}
      <Collapsible open={openSections.styles} onOpenChange={() => toggleSection('styles')}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-semibold">Estilos</h3>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', openSections.styles && 'rotate-180')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {filterOptions?.styles?.map((style) => (
            <div key={style.value} className="flex items-center space-x-2">
              <Checkbox
                id={`style-${style.value}`}
                checked={filters.styles?.includes(style.value)}
                onCheckedChange={(checked) => handleStyleChange(style.value, checked as boolean)}
              />
              <Label
                htmlFor={`style-${style.value}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{style.label}</span>
                <span className="text-muted-foreground text-xs">({style.count})</span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {hasActiveFilters() && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <aside className={cn('hidden lg:block', className)}>
        <div className="bg-card sticky top-6 rounded-lg border p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filtros</h2>
            {hasActiveFilters() && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            {hasActiveFilters() && (
              <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                {(filters.categories?.length ?? 0) +
                  (filters.materials?.length ?? 0) +
                  (filters.colors?.length ?? 0) +
                  (filters.styles?.length ?? 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export { SearchFilters };
