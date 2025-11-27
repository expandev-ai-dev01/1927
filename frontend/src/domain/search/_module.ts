export * from './components/SearchBar';
export * from './components/SearchFilters';
export * from './components/SearchResults';
export * from './components/ProductCard';

export * from './hooks/useSearch';
export * from './hooks/useSearchSuggestions';
export * from './hooks/useSearchHistory';
export * from './hooks/useFilterOptions';

export * from './services/searchService';
export * from './stores/searchStore';

export type {
  SearchFilters,
  SearchParams,
  Product,
  SearchResult,
  SearchSuggestion,
  SearchHistoryItem,
  FilterOption,
  FilterOptions,
  AppliedFilter,
} from './types/search';
