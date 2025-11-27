import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { searchProductList, searchFilterOptionsGet, searchSuggestionsGet } from '@/services/search';

const securable = 'SEARCH';

/**
 * @api {get} /internal/search/products Search Products
 * @apiName SearchProducts
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Performs comprehensive product search with filters, synonym expansion, and pagination
 *
 * @apiParam {String} [searchTerm] Search term (min 2 characters)
 * @apiParam {String} [productCode] Product code to search
 * @apiParam {String} [categories] JSON array of category names
 * @apiParam {Number} [priceMin] Minimum price filter
 * @apiParam {Number} [priceMax] Maximum price filter
 * @apiParam {String} [materials] JSON array of material names
 * @apiParam {String} [colors] JSON array of color names
 * @apiParam {String} [styles] JSON array of style names
 * @apiParam {Number} [heightMin] Minimum height in cm
 * @apiParam {Number} [heightMax] Maximum height in cm
 * @apiParam {Number} [widthMin] Minimum width in cm
 * @apiParam {Number} [widthMax] Maximum width in cm
 * @apiParam {Number} [depthMin] Minimum depth in cm
 * @apiParam {Number} [depthMax] Maximum depth in cm
 * @apiParam {String} [sortBy] Sort criteria (relevancia, nome_asc, nome_desc, preco_asc, preco_desc, data_cadastro_desc)
 * @apiParam {Number} [page] Page number (default: 1)
 * @apiParam {Number} [pageSize] Items per page (12, 24, 36, 48)
 *
 * @apiSuccess {Array} products List of matching products
 * @apiSuccess {Number} totalCount Total number of results
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} pageSize Items per page
 * @apiSuccess {Number} totalPages Total number of pages
 *
 * @apiError {String} searchTermTooShort Search term must be at least 2 characters
 * @apiError {String} invalidPageNumber Page number must be greater than 0
 * @apiError {String} invalidPageSize Page size must be 12, 24, 36, or 48
 */
export async function searchProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    searchTerm: z.string().min(2).max(100).optional(),
    productCode: z.string().max(50).optional(),
    categories: z.string().optional(),
    priceMin: z.coerce.number().nonnegative().optional(),
    priceMax: z.coerce.number().nonnegative().optional(),
    materials: z.string().optional(),
    colors: z.string().optional(),
    styles: z.string().optional(),
    heightMin: z.coerce.number().nonnegative().optional(),
    heightMax: z.coerce.number().nonnegative().optional(),
    widthMin: z.coerce.number().nonnegative().optional(),
    widthMax: z.coerce.number().nonnegative().optional(),
    depthMin: z.coerce.number().nonnegative().optional(),
    depthMax: z.coerce.number().nonnegative().optional(),
    sortBy: z
      .enum([
        'relevancia',
        'nome_asc',
        'nome_desc',
        'preco_asc',
        'preco_desc',
        'data_cadastro_desc',
      ])
      .optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce
      .number()
      .int()
      .refine((val) => [12, 24, 36, 48].includes(val))
      .optional(),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await searchProductList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /internal/search/filter-options Get Filter Options
 * @apiName GetFilterOptions
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves available filter options dynamically from the product catalog
 *
 * @apiSuccess {Array} categories Available categories with product counts
 * @apiSuccess {Array} materials Available materials with product counts
 * @apiSuccess {Array} colors Available colors with product counts
 * @apiSuccess {Array} styles Available styles with product counts
 * @apiSuccess {Object} priceRange Min and max price in catalog
 * @apiSuccess {Object} dimensionRanges Min and max dimensions in catalog
 *
 * @apiError {String} UnauthorizedError User lacks permission
 */
export async function getFilterOptionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, z.object({}));

  if (!validated) {
    return next(error);
  }

  try {
    const data = await searchFilterOptionsGet({
      ...validated.credential,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /internal/search/suggestions Get Search Suggestions
 * @apiName GetSearchSuggestions
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Provides autocomplete suggestions based on partial search term
 *
 * @apiParam {String} partialTerm Partial search term (min 2 characters)
 *
 * @apiSuccess {Array} suggestions List of suggestions with type and priority
 *
 * @apiError {String} partialTermTooShort Partial term must be at least 2 characters
 */
export async function getSuggestionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    partialTerm: z.string().min(2).max(100),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await searchSuggestionsGet({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
