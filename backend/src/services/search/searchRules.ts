import { dbRequest, ExpectedReturn, IRecordSet } from '@/utils/database';
import {
  SearchProductsRequest,
  SearchProductsResponse,
  SearchProduct,
  SearchMetadata,
  AutocompleteSuggestion,
  FilterOptions,
  FilterOption,
  SearchAlternatives,
  RelatedProduct,
} from './searchTypes';

/**
 * @summary
 * Performs comprehensive product search with filters and pagination
 *
 * @function searchProducts
 * @module search
 *
 * @param {SearchProductsRequest} params - Search parameters
 *
 * @returns {Promise<SearchProductsResponse>} Search results with metadata
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function searchProducts(
  params: SearchProductsRequest
): Promise<SearchProductsResponse> {
  const result = (await dbRequest(
    '[functional].[spSearchProducts]',
    {
      searchTerm: params.searchTerm || null,
      productCode: params.productCode || null,
      categories: params.categories ? JSON.stringify(params.categories) : null,
      priceMin: params.priceMin || null,
      priceMax: params.priceMax || null,
      materials: params.materials ? JSON.stringify(params.materials) : null,
      colors: params.colors ? JSON.stringify(params.colors) : null,
      styles: params.styles ? JSON.stringify(params.styles) : null,
      heightMin: params.heightMin || null,
      heightMax: params.heightMax || null,
      widthMin: params.widthMin || null,
      widthMax: params.widthMax || null,
      depthMin: params.depthMin || null,
      depthMax: params.depthMax || null,
      sortBy: params.sortBy || 'relevancia',
      page: params.page || 1,
      pageSize: params.pageSize || 24,
      sessionId: params.sessionId || null,
    },
    ExpectedReturn.Multi
  )) as IRecordSet<any>[];

  const products: SearchProduct[] = result[0];
  const metadata: SearchMetadata = result[1][0];

  return {
    products,
    metadata,
  };
}

/**
 * @summary
 * Provides autocomplete suggestions for search input
 *
 * @function searchAutocomplete
 * @module search
 *
 * @param {string} searchTerm - Partial search term
 * @param {number} maxSuggestions - Maximum suggestions to return
 *
 * @returns {Promise<AutocompleteSuggestion[]>} Array of suggestions
 *
 * @throws {ValidationError} When search term is too short
 * @throws {DatabaseError} When database operation fails
 */
export async function searchAutocomplete(
  searchTerm: string,
  maxSuggestions: number = 10
): Promise<AutocompleteSuggestion[]> {
  const result = await dbRequest(
    '[functional].[spSearchAutocomplete]',
    {
      searchTerm,
      maxSuggestions,
    },
    ExpectedReturn.Multiple
  );

  return result as AutocompleteSuggestion[];
}

/**
 * @summary
 * Retrieves available filter options from catalog
 *
 * @function getFilterOptions
 * @module search
 *
 * @param {string[]} appliedCategories - Already applied category filters
 * @param {string[]} appliedMaterials - Already applied material filters
 * @param {string[]} appliedColors - Already applied color filters
 * @param {string[]} appliedStyles - Already applied style filters
 *
 * @returns {Promise<FilterOptions>} Available filter options
 *
 * @throws {DatabaseError} When database operation fails
 */
export async function getFilterOptions(
  appliedCategories?: string[],
  appliedMaterials?: string[],
  appliedColors?: string[],
  appliedStyles?: string[]
): Promise<FilterOptions> {
  const result = (await dbRequest(
    '[functional].[spSearchGetFilterOptions]',
    {
      appliedCategories: appliedCategories ? JSON.stringify(appliedCategories) : null,
      appliedMaterials: appliedMaterials ? JSON.stringify(appliedMaterials) : null,
      appliedColors: appliedColors ? JSON.stringify(appliedColors) : null,
      appliedStyles: appliedStyles ? JSON.stringify(appliedStyles) : null,
    },
    ExpectedReturn.Multi
  )) as IRecordSet<any>[];

  const categories: FilterOption[] = result[0].map((row: any) => ({
    value: row.category,
    productCount: row.productCount,
  }));

  const materials: FilterOption[] = result[1].map((row: any) => ({
    value: row.material,
    productCount: row.productCount,
  }));

  const colors: FilterOption[] = result[2].map((row: any) => ({
    value: row.color,
    productCount: row.productCount,
  }));

  const styles: FilterOption[] = result[3].map((row: any) => ({
    value: row.style,
    productCount: row.productCount,
  }));

  const priceRange = result[4][0];
  const dimensionRanges = result[5][0];

  return {
    categories,
    materials,
    colors,
    styles,
    minPrice: priceRange.minPrice,
    maxPrice: priceRange.maxPrice,
    minHeight: dimensionRanges.minHeight,
    maxHeight: dimensionRanges.maxHeight,
    minWidth: dimensionRanges.minWidth,
    maxWidth: dimensionRanges.maxWidth,
    minDepth: dimensionRanges.minDepth,
    maxDepth: dimensionRanges.maxDepth,
  };
}

/**
 * @summary
 * Provides alternative suggestions and related products for no-results scenarios
 *
 * @function getSearchAlternatives
 * @module search
 *
 * @param {string} searchTerm - Original search term
 * @param {number} maxSuggestions - Maximum suggestions to return
 * @param {number} maxProducts - Maximum related products to return
 *
 * @returns {Promise<SearchAlternatives>} Alternative suggestions and products
 *
 * @throws {ValidationError} When search term is invalid
 * @throws {DatabaseError} When database operation fails
 */
export async function getSearchAlternatives(
  searchTerm: string,
  maxSuggestions: number = 5,
  maxProducts: number = 8
): Promise<SearchAlternatives> {
  const result = (await dbRequest(
    '[functional].[spSearchGetAlternatives]',
    {
      searchTerm,
      maxSuggestions,
      maxProducts,
    },
    ExpectedReturn.Multi
  )) as IRecordSet<any>[];

  const suggestions: string[] = result[0].map((row: any) => row.suggestion);
  const relatedProducts: RelatedProduct[] = result[1];

  return {
    suggestions,
    relatedProducts,
  };
}
