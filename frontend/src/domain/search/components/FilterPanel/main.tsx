import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';
import { Slider } from '@/core/components/slider';
import { cn } from '@/core/lib/utils';
import { useFilterOptions } from '../../hooks';
import { useSearchStore } from '../../stores';
import type { FilterPanelProps } from './types';

function FilterPanel({ className }: FilterPanelProps) {
  const { filterOptions, isLoading } = useFilterOptions();
  const { filters, updateFilter, clearFilters } = useSearchStore();
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

  const handleCategoryToggle = (category: string) => {
    const current = filters.categories ?? [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    updateFilter('categories', updated.length > 0 ? updated : undefined);
  };

  const handleMaterialToggle = (material: string) => {
    const current = filters.materials ?? [];
    const updated = current.includes(material)
      ? current.filter((m) => m !== material)
      : [...current, material];
    updateFilter('materials', updated.length > 0 ? updated : undefined);
  };

  const handleColorToggle = (color: string) => {
    const current = filters.colors ?? [];
    const updated = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    updateFilter('colors', updated.length > 0 ? updated : undefined);
  };

  const handleStyleToggle = (style: string) => {
    const current = filters.styles ?? [];
    const updated = current.includes(style)
      ? current.filter((s) => s !== style)
      : [...current, style];
    updateFilter('styles', updated.length > 0 ? updated : undefined);
  };

  const handlePriceChange = (values: number[]) => {
    updateFilter('priceMin', values[0]);
    updateFilter('priceMax', values[1]);
  };

  if (isLoading) {
    return (
      <div className={cn('bg-card rounded-lg border p-6 shadow-sm', className)}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-12 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!filterOptions) return null;

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b pb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="hover:text-primary flex w-full items-center justify-between py-2 text-left font-medium transition-colors"
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {expandedSections[sectionKey] && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );

  return (
    <div className={cn('bg-card rounded-lg border shadow-sm', className)}>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
          <X className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <FilterSection title="Categorias" sectionKey="categories">
          {filterOptions.categories?.map((cat) => (
            <div key={cat.name} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.name}`}
                checked={filters.categories?.includes(cat.name) ?? false}
                onCheckedChange={() => handleCategoryToggle(cat.name)}
              />
              <Label
                htmlFor={`cat-${cat.name}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{cat.name}</span>
                <span className="text-muted-foreground text-xs">({cat.count})</span>
              </Label>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Faixa de Preço" sectionKey="price">
          <div className="space-y-4 px-2">
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                R$ {filters.priceMin ?? filterOptions.priceRange.min}
              </span>
              <span className="text-muted-foreground">
                R$ {filters.priceMax ?? filterOptions.priceRange.max}
              </span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Materiais" sectionKey="materials">
          {filterOptions.materials?.map((mat) => (
            <div key={mat.name} className="flex items-center space-x-2">
              <Checkbox
                id={`mat-${mat.name}`}
                checked={filters.materials?.includes(mat.name) ?? false}
                onCheckedChange={() => handleMaterialToggle(mat.name)}
              />
              <Label
                htmlFor={`mat-${mat.name}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{mat.name}</span>
                <span className="text-muted-foreground text-xs">({mat.count})</span>
              </Label>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Cores" sectionKey="colors">
          {filterOptions.colors?.map((col) => (
            <div key={col.name} className="flex items-center space-x-2">
              <Checkbox
                id={`col-${col.name}`}
                checked={filters.colors?.includes(col.name) ?? false}
                onCheckedChange={() => handleColorToggle(col.name)}
              />
              <Label
                htmlFor={`col-${col.name}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{col.name}</span>
                <span className="text-muted-foreground text-xs">({col.count})</span>
              </Label>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Estilos" sectionKey="styles">
          {filterOptions.styles?.map((sty) => (
            <div key={sty.name} className="flex items-center space-x-2">
              <Checkbox
                id={`sty-${sty.name}`}
                checked={filters.styles?.includes(sty.name) ?? false}
                onCheckedChange={() => handleStyleToggle(sty.name)}
              />
              <Label
                htmlFor={`sty-${sty.name}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
              >
                <span>{sty.name}</span>
                <span className="text-muted-foreground text-xs">({sty.count})</span>
              </Label>
            </div>
          ))}
        </FilterSection>
      </div>
    </div>
  );
}

export { FilterPanel };
