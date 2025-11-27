import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchFilters } from '../types/search';

interface FavoriteSearch {
  id: string;
  name: string;
  searchTerm?: string;
  filters?: SearchFilters;
  createdAt: string;
}

interface SearchStore {
  searchTerm: string;
  filters: SearchFilters;
  sortBy: 'relevancia' | 'nome_asc' | 'nome_desc' | 'preco_asc' | 'preco_desc' | 'data_cadastro_desc';
  viewMode: 'grade' | 'lista';
  pageSize: 12 | 24 | 36 | 48;
  favoriteSearches: FavoriteSearch[];

  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SearchStore['sortBy']) => void;
  setViewMode: (mode: 'grade' | 'lista') => void;
  setPageSize: (size: 12 | 24 | 36 | 48) => void;
  addFavoriteSearch: (name: string, searchTerm?: string, filters?: SearchFilters) => void;
  removeFavoriteSearch: (id: string) => void;
  loadFavoriteSearch: (id: string) => void;
}

export const useSearchStore = create<SearchStore>()(n  persist(
    (set, get) => ({
      searchTerm: '',
      filters: {},
      sortBy: 'relevancia',
      viewMode: 'grade',
      pageSize: 24,
      favoriteSearches: [],

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

      addFavoriteSearch: (name, searchTerm, filters) => {
        const newFavorite: FavoriteSearch = {
          id: Date.now().toString(),
          name,
          searchTerm,
          filters,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          favoriteSearches: [...state.favoriteSearches, newFavorite],
        }));
      },

      removeFavoriteSearch: (id) =>
        set((state) => ({
          favoriteSearches: state.favoriteSearches.filter((fav) => fav.id !== id),
        })),

      loadFavoriteSearch: (id) => {
        const favorite = get().favoriteSearches.find((fav) => fav.id === id);
        if (favorite) {
          set({
            searchTerm: favorite.searchTerm ?? '',
            filters: favorite.filters ?? {},
          });
        }
      },
    }),
    {
      name: 'search-store',
    }
  )
);
