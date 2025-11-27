import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SearchFilters,
  SearchHistoryItem,
  SearchFavorite,
} from '../types';

interface SearchStore {
  // Current search state
  searchTerm: string;
  filters: SearchFilters;
  viewMode: 'grade' | 'lista';
  sortBy: 'relevancia' | 'nome_asc' | 'nome_desc' | 'preco_asc' | 'preco_desc' | 'data_cadastro_desc';
  itemsPerPage: 12 | 24 | 36 | 48;
  currentPage: number;

  // History and favorites
  searchHistory: SearchHistoryItem[];
  favorites: SearchFavorite[];

  // Actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setViewMode: (mode: 'grade' | 'lista') => void;
  setSortBy: (sort: SearchStore['sortBy']) => void;
  setItemsPerPage: (items: SearchStore['itemsPerPage']) => void;
  setCurrentPage: (page: number) => void;

  // History management
  addToHistory: (item: SearchHistoryItem) => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;

  // Favorites management
  addFavorite: (favorite: Omit<SearchFavorite, 'id' | 'data_criacao'>) => void;
  removeFavorite: (id: string) => void;
  loadFavorite: (id: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  searchTerm: '',
  filters: {},
  viewMode: 'grade' as const,
  sortBy: 'relevancia' as const,
  itemsPerPage: 24 as const,
  currentPage: 1,
  searchHistory: [],
  favorites: [],
};

export const useSearchStore = create<SearchStore>()(n  persist(
    (set, get) => ({
      ...initialState,

      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),

      setFilters: (filters) => set({ filters, currentPage: 1 }),

      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          currentPage: 1,
        })),

      clearFilters: () => set({ filters: {}, currentPage: 1 }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),

      setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),

      setCurrentPage: (page) => set({ currentPage: page }),

      addToHistory: (item) =>
        set((state) => {
          const newHistory = [item, ...state.searchHistory].slice(0, 10);
          return { searchHistory: newHistory };
        }),

      removeFromHistory: (index) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((_, i) => i !== index),
        })),

      clearHistory: () => set({ searchHistory: [] }),

      addFavorite: (favorite) =>
        set((state) => {
          const newFavorite: SearchFavorite = {
            ...favorite,
            id: `fav-${Date.now()}`,
            data_criacao: new Date().toISOString(),
          };
          return { favorites: [...state.favorites, newFavorite] };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      loadFavorite: (id) => {
        const favorite = get().favorites.find((f) => f.id === id);
        if (favorite) {
          set({
            searchTerm: favorite.termo || '',
            filters: favorite.filtros || {},
            currentPage: 1,
          });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'search-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        itemsPerPage: state.itemsPerPage,
        searchHistory: state.searchHistory,
        favorites: state.favorites,
      }),
    }
  )
);
