import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Label } from '@/core/components/label';
import { Checkbox } from '@/core/components/checkbox';
import { Input } from '@/core/components/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/core/components/collapsible';
import { useSearchStore } from '../../stores/searchStore';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { cn } from '@/core/lib/utils';
import type { SearchFiltersProps } from './types';

function SearchFilters({ className }: SearchFiltersProps) {
  const { filters, updateFilter, clearFilters } = useSearchStore();
  const { options, isLoading } = useFilterOptions();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categoria: true,
    preco: true,
    material: false,
    cor: false,
    estilo: false,
    dimensoes: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (
    filterKey: 'categoria' | 'material' | 'cor' | 'estilo',
    value: string
  ) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateFilter(filterKey, newValues.length > 0 ? newValues : undefined);
  };

  const handlePriceChange = (type: 'minimo' | 'maximo', value: string) => {
    const numValue = value === '' ? null : Number(value);
    updateFilter('faixa_preco', {
      ...filters.faixa_preco,
      [type]: numValue,
    });
  };

  const handleDimensionChange = (
    dimension: 'altura' | 'largura' | 'profundidade',
    type: 'minimo' | 'maximo',
    value: string
  ) => {
    const numValue = value === '' ? null : Number(value);
    updateFilter('dimensoes', {
      ...filters.dimensoes,
      [dimension]: {
        ...(filters.dimensoes?.[dimension] || {}),
        [type]: numValue,
      },
    });
  };

  if (isLoading) {
    return (
      <div className={cn('bg-card rounded-lg border p-6', className)}>
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

  return (
    <div className={cn('bg-card rounded-lg border', className)}>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
          Limpar tudo
        </Button>
      </div>

      <div className="divide-y">
        {/* Categoria */}
        <Collapsible open={openSections.categoria} onOpenChange={() => toggleSection('categoria')}>
          <CollapsibleTrigger className="hover:bg-accent/50 flex w-full items-center justify-between p-4">
            <span className="font-medium">Categoria</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', openSections.categoria && 'rotate-180')}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-2">
              {options?.categorias?.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={filters.categoria?.includes(cat)}
                    onCheckedChange={() => handleCheckboxChange('categoria', cat)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="cursor-pointer text-sm font-normal">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Faixa de Preço */}
        <Collapsible open={openSections.preco} onOpenChange={() => toggleSection('preco')}>
          <CollapsibleTrigger className="hover:bg-accent/50 flex w-full items-center justify-between p-4">
            <span className="font-medium">Faixa de Preço</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', openSections.preco && 'rotate-180')}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="preco-min">Mínimo (R$)</Label>
                <Input
                  id="preco-min"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.faixa_preco?.minimo ?? ''}
                  onChange={(e) => handlePriceChange('minimo', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="preco-max">Máximo (R$)</Label>
                <Input
                  id="preco-max"
                  type="number"
                  min="0"
                  placeholder="Sem limite"
                  value={filters.faixa_preco?.maximo ?? ''}
                  onChange={(e) => handlePriceChange('maximo', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Material */}
        <Collapsible open={openSections.material} onOpenChange={() => toggleSection('material')}>
          <CollapsibleTrigger className="hover:bg-accent/50 flex w-full items-center justify-between p-4">
            <span className="font-medium">Material</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', openSections.material && 'rotate-180')}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-2">
              {options?.materiais?.map((mat) => (
                <div key={mat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mat-${mat}`}
                    checked={filters.material?.includes(mat)}
                    onCheckedChange={() => handleCheckboxChange('material', mat)}
                  />
                  <Label htmlFor={`mat-${mat}`} className="cursor-pointer text-sm font-normal">
                    {mat}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Cor */}
        <Collapsible open={openSections.cor} onOpenChange={() => toggleSection('cor')}>
          <CollapsibleTrigger className="hover:bg-accent/50 flex w-full items-center justify-between p-4">
            <span className="font-medium">Cor</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', openSections.cor && 'rotate-180')}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-2">
              {options?.cores?.map((cor) => (
                <div key={cor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cor-${cor}`}
                    checked={filters.cor?.includes(cor)}
                    onCheckedChange={() => handleCheckboxChange('cor', cor)}
                  />
                  <Label htmlFor={`cor-${cor}`} className="cursor-pointer text-sm font-normal">
                    {cor}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Estilo */}
        <Collapsible open={openSections.estilo} onOpenChange={() => toggleSection('estilo')}>
          <CollapsibleTrigger className="hover:bg-accent/50 flex w-full items-center justify-between p-4">
            <span className="font-medium">Estilo</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', openSections.estilo && 'rotate-180')}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-2">
              {options?.estilos?.map((est) => (
                <div key={est} className="flex items-center space-x-2">
                  <Checkbox
                    id={`est-${est}`}
                    checked={filters.estilo?.includes(est)}
                    onCheckedChange={() => handleCheckboxChange('estilo', est)}
                  />
                  <Label htmlFor={`est-${est}`} className="cursor-pointer text-sm font-normal">
                    {est}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

export { SearchFilters };
