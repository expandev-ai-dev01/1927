/**
 * @api {get} /internal/search/filter-options Get Filter Options
 * @apiName GetFilterOptions
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves available filter options dynamically from the product catalog
 *
 * @apiParam {String} [categories] JSON array of currently selected categories
 * @apiParam {Number} [priceMin] Currently selected minimum price
 * @apiParam {Number} [priceMax] Currently selected maximum price
 * @apiParam {String} [materials] JSON array of currently selected materials
 * @apiParam {String} [colors] JSON array of currently selected colors
 * @apiParam {String} [styles] JSON array of currently selected styles
 *
 * @apiSuccess {Array} categories Available categories with product counts
 * @apiSuccess {Array} materials Available materials with product counts
 * @apiSuccess {Array} colors Available colors with product counts
 * @apiSuccess {Array} styles Available styles with product counts
 * @apiSuccess {Object} priceRange Price range in catalog
 * @apiSuccess {Object} dimensionRanges Dimension ranges in catalog
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse, StatusGeneralError, successResponse } from '@/middleware/crud';
import { searchFilterOptionsGet } from '@/services/search';

const querySchema = z.object({
  categories: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  materials: z.string().optional(),
  colors: z.string().optional(),
  styles: z.string().optional(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = querySchema.parse(req.query);

    const currentFilters = {
      categories: validated.categories ? JSON.parse(validated.categories) : undefined,
      priceMin: validated.priceMin,
      priceMax: validated.priceMax,
      materials: validated.materials ? JSON.parse(validated.materials) : undefined,
      colors: validated.colors ? JSON.parse(validated.colors) : undefined,
      styles: validated.styles ? JSON.parse(validated.styles) : undefined,
    };

    const data = await searchFilterOptionsGet(1, currentFilters);

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
