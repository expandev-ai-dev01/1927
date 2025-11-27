/**
 * @api {get} /internal/search/products Search Products
 * @apiName SearchProducts
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Performs comprehensive product search with filters, sorting, and pagination
 *
 * @apiParam {String} [searchTerm] Search term (minimum 2 characters)
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
 * @apiParam {Number} [pageNumber] Page number (default 1)
 * @apiParam {Number} [pageSize] Items per page (default 24, allowed: 12, 24, 36, 48)
 *
 * @apiSuccess {Array} products Array of product results
 * @apiSuccess {Number} totalResults Total number of results
 * @apiSuccess {Number} pageNumber Current page number
 * @apiSuccess {Number} pageSize Items per page
 * @apiSuccess {Number} totalPages Total number of pages
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse, StatusGeneralError, successResponse } from '@/middleware/crud';
import { searchProductList } from '@/services/search';

const querySchema = z.object({
  searchTerm: z.string().min(2).max(100).optional(),
  categories: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  materials: z.string().optional(),
  colors: z.string().optional(),
  styles: z.string().optional(),
  heightMin: z.coerce.number().min(0).optional(),
  heightMax: z.coerce.number().min(0).optional(),
  widthMin: z.coerce.number().min(0).optional(),
  widthMax: z.coerce.number().min(0).optional(),
  depthMin: z.coerce.number().min(0).optional(),
  depthMax: z.coerce.number().min(0).optional(),
  sortBy: z
    .enum(['relevancia', 'nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc'])
    .optional(),
  pageNumber: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce
    .number()
    .int()
    .refine((val) => [12, 24, 36, 48].includes(val))
    .optional(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = querySchema.parse(req.query);

    const filters = {
      categories: validated.categories ? JSON.parse(validated.categories) : undefined,
      priceMin: validated.priceMin,
      priceMax: validated.priceMax,
      materials: validated.materials ? JSON.parse(validated.materials) : undefined,
      colors: validated.colors ? JSON.parse(validated.colors) : undefined,
      styles: validated.styles ? JSON.parse(validated.styles) : undefined,
      dimensions: {
        heightMin: validated.heightMin,
        heightMax: validated.heightMax,
        widthMin: validated.widthMin,
        widthMax: validated.widthMax,
        depthMin: validated.depthMin,
        depthMax: validated.depthMax,
      },
    };

    const data = await searchProductList({
      idAccount: 1,
      searchTerm: validated.searchTerm,
      filters,
      sortBy: validated.sortBy,
      pageNumber: validated.pageNumber,
      pageSize: validated.pageSize as 12 | 24 | 36 | 48,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('validationError'));
    } else if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
