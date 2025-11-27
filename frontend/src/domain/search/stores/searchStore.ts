import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchFilters, SearchHistoryItem } from '../types/search';

interface FavoriteSearch {
  id: string;
  name: string;
  searchTerm?: string;
  filters?: SearchFilters;
  createdAt: string;
}

interface SearchStore {
  // Current search state
  searchTerm: string;
  filters: SearchFilters;
  sortBy: 'relevancia' | 'nome_asc' | 'nome_desc' | 'preco_asc' | 'preco_desc' | 'data_cadastro_desc';
  viewMode: 'grade' | 'lista';
  pageSize: 12 | 24 | 36 | 48;
  currentPage: number;
  isLoading: boolean;

  // History and favorites (persisted)
  searchHistory: SearchHistoryItem[];
  favoriteSearches: FavoriteSearch[];

  // Actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SearchStore['sortBy']) => void;
  setViewMode: (mode: 'grade' | 'lista') => void;
  setPageSize: (size: 12 | 24 | 36 | 48) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (loading: boolean) => void;

  // History actions
  addToHistory: (item: SearchHistoryItem) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: number) => void;

  // Favorites actions
  addFavorite: (name: string, searchTerm?: string, filters?: SearchFilters) => void;
  removeFavorite: (id: string) => void;
  loadFavorite: (id: string) => void;

  // Reset
  resetSearch: () => void;
}

const initialFilters: SearchFilters = {
  categories: [],
  priceMin: null,
  priceMax: null,
  materials: [],
  colors: [],
  styles: [],
  dimensions: {
    heightMin: null,
    heightMax: null,
    widthMin: null,
    widthMax: null,
    depthMin: null,
    depthMax: null,
  },
};

export const useSearchStore = create<SearchStore>()(n  persist(
    (set, get) => ({
      // Initial state
      searchTerm: '',
      filters: initialFilters,
      sortBy: 'relevancia',
      viewMode: 'grade',
      pageSize: 24,
      currentPage: 1,
      isLoading: false,
      searchHistory: [],
      favoriteSearches: [],

      // Actions
      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),

      setFilters: (filters) => set({ filters, currentPage: 1 }),

      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          currentPage: 1,
        })),

      clearFilters: () => set({ filters: initialFilters, currentPage: 1 }),

      setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      // History actions
      addToHistory: (item) =>
        set((state) => {
          const history = [item, ...state.searchHistory.filter((h) => h.id !== item.id)].slice(
            0,
            10
          );
          return { searchHistory: history };
        }),

      clearHistory: () => set({ searchHistory: [] }),

      removeHistoryItem: (id) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((item) => item.id !== id),
        })),

      // Favorites actions
      addFavorite: (name, searchTerm, filters) =>
        set((state) => {
          const newFavorite: FavoriteSearch = {
            id: Date.now().toString(),
            name,
            searchTerm,
            filters,
            createdAt: new Date().toISOString(),
          };
          return { favoriteSearches: [...state.favoriteSearches, newFavorite] };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          favoriteSearches: state.favoriteSearches.filter((fav) => fav.id !== id),
        })),

      loadFavorite: (id) => {
        const favorite = get().favoriteSearches.find((fav) => fav.id === id);
        if (favorite) {
          set({
            searchTerm: favorite.searchTerm || '',
            filters: favorite.filters || initialFilters,
            currentPage: 1,
          });
        }
      },

      // Reset
      resetSearch: () =>
        set({
          searchTerm: '',
          filters: initialFilters,
          sortBy: 'relevancia',
          currentPage: 1,
        }),
    }),
    {
      name: 'search-store',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        favoriteSearches: state.favoriteSearches,
        viewMode: state.viewMode,
        pageSize: state.pageSize,
      }),
    }
  )
);
