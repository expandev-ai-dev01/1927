export * from './components';
export * from './hooks/useSearchProducts';
export * from './hooks/useFilterOptions';
export * from './hooks/useSearchSuggestions';
export * from './services/searchService';
export * from './stores/searchStore';
export * from './utils/filterUtils';

export type {
  SearchFilters,
  SearchParams,
  Product,
  SearchResult,
  FilterOption,
  FilterOptions,
  SearchSuggestion,
  SearchHistoryItem,
  AppliedFilter,
} from './types/search';
