import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchFilters } from '../types/search';

interface SavedSearch {
  id: string;
  name: string;
  searchTerm?: string;
  filters: SearchFilters;
  createdAt: string;
}

interface SearchStore {
  searchTerm: string;
  filters: SearchFilters;
  sortBy: 'relevancia' | 'nome_asc' | 'nome_desc' | 'preco_asc' | 'preco_desc' | 'data_cadastro_desc';
  viewMode: 'grade' | 'lista';
  pageSize: 12 | 24 | 36 | 48;
  savedSearches: SavedSearch[];

  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SearchStore['sortBy']) => void;
  setViewMode: (mode: 'grade' | 'lista') => void;
  setPageSize: (size: 12 | 24 | 36 | 48) => void;
  saveSearch: (name: string) => void;
  deleteSavedSearch: (id: string) => void;
  loadSavedSearch: (id: string) => void;
}

export const useSearchStore = create<SearchStore>()(n  persist(
    (set, get) => ({
      searchTerm: '',
      filters: {},
      sortBy: 'relevancia',
      viewMode: 'grade',
      pageSize: 24,
      savedSearches: [],

      setSearchTerm: (term) => set({ searchTerm: term }),

      setFilters: (filters) => set({ filters }),

      updateFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),

      clearFilters: () => set({ filters: {} }),

      setSortBy: (sortBy) => set({ sortBy }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setPageSize: (size) => set({ pageSize: size }),

      saveSearch: (name) => {
        const state = get();
        const newSearch: SavedSearch = {
          id: Date.now().toString(),
          name,
          searchTerm: state.searchTerm,
          filters: state.filters,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          savedSearches: [...state.savedSearches, newSearch],
        }));
      },

      deleteSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((search) => search.id !== id),
        })),

      loadSavedSearch: (id) => {
        const state = get();
        const savedSearch = state.savedSearches.find((search) => search.id === id);
        if (savedSearch) {
          set({
            searchTerm: savedSearch.searchTerm ?? '',
            filters: savedSearch.filters,
          });
        }
      },
    }),
    {
      name: 'search-store',
    }
  )
);
