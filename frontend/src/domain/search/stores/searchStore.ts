import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchFilters, AppliedFilter } from '../types';

interface SearchStore {
  searchTerm: string;
  filters: SearchFilters;
  sortBy: 'relevancia' | 'nome_asc' | 'nome_desc' | 'preco_asc' | 'preco_desc' | 'data_cadastro_desc';
  viewMode: 'grade' | 'lista';
  pageSize: 12 | 24 | 36 | 48;
  page: number;
  appliedFilters: AppliedFilter[];

  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  removeFilter: (type: AppliedFilter['type'], value: string) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SearchStore['sortBy']) => void;
  setViewMode: (mode: 'grade' | 'lista') => void;
  setPageSize: (size: 12 | 24 | 36 | 48) => void;
  setPage: (page: number) => void;
  updateAppliedFilters: () => void;
}

export const useSearchStore = create<SearchStore>()(n  persist(
    (set, get) => ({
      searchTerm: '',
      filters: {},
      sortBy: 'relevancia',
      viewMode: 'grade',
      pageSize: 24,
      page: 1,
      appliedFilters: [],

      setSearchTerm: (term) => set({ searchTerm: term, page: 1 }),

      setFilters: (filters) => {
        set({ filters, page: 1 });
        get().updateAppliedFilters();
      },

      updateFilter: (key, value) => {
        const currentFilters = get().filters;
        set({ filters: { ...currentFilters, [key]: value }, page: 1 });
        get().updateAppliedFilters();
      },

      removeFilter: (type, value) => {
        const currentFilters = get().filters;
        const newFilters = { ...currentFilters };

        switch (type) {
          case 'category':
            newFilters.categories = currentFilters.categories?.filter((c) => c !== value);
            break;
          case 'material':
            newFilters.materials = currentFilters.materials?.filter((m) => m !== value);
            break;
          case 'color':
            newFilters.colors = currentFilters.colors?.filter((c) => c !== value);
            break;
          case 'style':
            newFilters.styles = currentFilters.styles?.filter((s) => s !== value);
            break;
          case 'price':
            newFilters.priceMin = null;
            newFilters.priceMax = null;
            break;
          case 'dimensions':
            newFilters.heightMin = null;
            newFilters.heightMax = null;
            newFilters.widthMin = null;
            newFilters.widthMax = null;
            newFilters.depthMin = null;
            newFilters.depthMax = null;
            break;
        }

        set({ filters: newFilters, page: 1 });
        get().updateAppliedFilters();
      },

      clearFilters: () => {
        set({ filters: {}, page: 1, appliedFilters: [] });
      },

      setSortBy: (sortBy) => set({ sortBy, page: 1 }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setPageSize: (size) => set({ pageSize: size, page: 1 }),

      setPage: (page) => set({ page }),

      updateAppliedFilters: () => {
        const { filters } = get();
        const applied: AppliedFilter[] = [];

        filters.categories?.forEach((cat) => {
          applied.push({ type: 'category', label: 'Categoria', value: cat });
        });

        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
          const min = filters.priceMin ?? 0;
          const max = filters.priceMax ?? '∞';
          applied.push({
            type: 'price',
            label: 'Preço',
            value: `R$ ${min} - ${max}`,
          });
        }

        filters.materials?.forEach((mat) => {
          applied.push({ type: 'material', label: 'Material', value: mat });
        });

        filters.colors?.forEach((col) => {
          applied.push({ type: 'color', label: 'Cor', value: col });
        });

        filters.styles?.forEach((sty) => {
          applied.push({ type: 'style', label: 'Estilo', value: sty });
        });

        if (
          filters.heightMin !== undefined ||
          filters.heightMax !== undefined ||
          filters.widthMin !== undefined ||
          filters.widthMax !== undefined ||
          filters.depthMin !== undefined ||
          filters.depthMax !== undefined
        ) {
          applied.push({
            type: 'dimensions',
            label: 'Dimensões',
            value: 'Personalizado',
          });
        }

        set({ appliedFilters: applied });
      },
    }),
    {
      name: 'search-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        pageSize: state.pageSize,
      }),
    }
  )
);
