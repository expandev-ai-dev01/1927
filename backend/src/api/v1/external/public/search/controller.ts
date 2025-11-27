import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse, successResponse } from '@/utils/response';
import {
  searchProducts,
  searchAutocomplete,
  getFilterOptions,
  getSearchAlternatives,
  SearchProductsRequest,
} from '@/services/search';

const searchSchema = z.object({
  searchTerm: z.string().min(2).max(100).optional(),
  productCode: z.string().max(50).optional(),
  categories: z.array(z.string()).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  materials: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  styles: z.array(z.string()).optional(),
  heightMin: z.number().min(0).optional(),
  heightMax: z.number().min(0).optional(),
  widthMin: z.number().min(0).optional(),
  widthMax: z.number().min(0).optional(),
  depthMin: z.number().min(0).optional(),
  depthMax: z.number().min(0).optional(),
  sortBy: z
    .enum(['relevancia', 'nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc'])
    .optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.enum([12, 24, 36, 48]).optional(),
  sessionId: z.string().max(100).optional(),
});

const autocompleteSchema = z.object({
  searchTerm: z.string().min(2).max(100),
  maxSuggestions: z.number().int().min(1).max(20).optional(),
});

const filterOptionsSchema = z.object({
  appliedCategories: z.array(z.string()).optional(),
  appliedMaterials: z.array(z.string()).optional(),
  appliedColors: z.array(z.string()).optional(),
  appliedStyles: z.array(z.string()).optional(),
});

const alternativesSchema = z.object({
  searchTerm: z.string().min(2).max(100),
  maxSuggestions: z.number().int().min(1).max(10).optional(),
  maxProducts: z.number().int().min(1).max(20).optional(),
});

/**
 * @api {post} /external/public/search Search Products
 * @apiName SearchProducts
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Performs comprehensive product search with filters and pagination
 *
 * @apiParam {String} [searchTerm] Search term (2-100 characters)
 * @apiParam {String} [productCode] Product code for exact match
 * @apiParam {String[]} [categories] Category filters
 * @apiParam {Number} [priceMin] Minimum price
 * @apiParam {Number} [priceMax] Maximum price
 * @apiParam {String[]} [materials] Material filters
 * @apiParam {String[]} [colors] Color filters
 * @apiParam {String[]} [styles] Style filters
 * @apiParam {Number} [heightMin] Minimum height (cm)
 * @apiParam {Number} [heightMax] Maximum height (cm)
 * @apiParam {Number} [widthMin] Minimum width (cm)
 * @apiParam {Number} [widthMax] Maximum width (cm)
 * @apiParam {Number} [depthMin] Minimum depth (cm)
 * @apiParam {Number} [depthMax] Maximum depth (cm)
 * @apiParam {String} [sortBy] Sort criteria
 * @apiParam {Number} [page] Page number
 * @apiParam {Number} [pageSize] Items per page
 * @apiParam {String} [sessionId] Session identifier
 *
 * @apiSuccess {Object[]} products Array of products
 * @apiSuccess {Object} metadata Search metadata
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = searchSchema.parse(req.body) as SearchProductsRequest;

    const result = await searchProducts(validated);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('validationError', error.errors));
    } else if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /external/public/search/autocomplete Get Autocomplete Suggestions
 * @apiName SearchAutocomplete
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Provides autocomplete suggestions for search input
 *
 * @apiParam {String} searchTerm Partial search term (2-100 characters)
 * @apiParam {Number} [maxSuggestions] Maximum suggestions (default 10)
 *
 * @apiSuccess {Object[]} suggestions Array of suggestions
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} ServerError Internal server error
 */
export async function getAutocompleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = autocompleteSchema.parse(req.query);

    const suggestions = await searchAutocomplete(validated.searchTerm, validated.maxSuggestions);

    res.json(successResponse(suggestions));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('validationError', error.errors));
    } else if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /external/public/search/filter-options Get Filter Options
 * @apiName GetFilterOptions
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves available filter options from catalog
 *
 * @apiParam {String[]} [appliedCategories] Applied category filters
 * @apiParam {String[]} [appliedMaterials] Applied material filters
 * @apiParam {String[]} [appliedColors] Applied color filters
 * @apiParam {String[]} [appliedStyles] Applied style filters
 *
 * @apiSuccess {Object} filterOptions Available filter options
 *
 * @apiError {String} ServerError Internal server error
 */
export async function getFilterOptionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = filterOptionsSchema.parse(req.query);

    const filterOptions = await getFilterOptions(
      validated.appliedCategories,
      validated.appliedMaterials,
      validated.appliedColors,
      validated.appliedStyles
    );

    res.json(successResponse(filterOptions));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('validationError', error.errors));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /external/public/search/alternatives Get Search Alternatives
 * @apiName GetSearchAlternatives
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Provides alternative suggestions and related products for no-results scenarios
 *
 * @apiParam {String} searchTerm Original search term (2-100 characters)
 * @apiParam {Number} [maxSuggestions] Maximum suggestions (default 5)
 * @apiParam {Number} [maxProducts] Maximum related products (default 8)
 *
 * @apiSuccess {String[]} suggestions Alternative search terms
 * @apiSuccess {Object[]} relatedProducts Related products
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} ServerError Internal server error
 */
export async function getAlternativesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = alternativesSchema.parse(req.query);

    const alternatives = await getSearchAlternatives(
      validated.searchTerm,
      validated.maxSuggestions,
      validated.maxProducts
    );

    res.json(successResponse(alternatives));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('validationError', error.errors));
    } else if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
