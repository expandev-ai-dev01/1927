/**
 * @api {get} /internal/search/suggestions Get Search Suggestions
 * @apiName GetSearchSuggestions
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Provides autocomplete suggestions based on partial search term
 *
 * @apiParam {String} partialTerm Partial search term (minimum 2 characters)
 * @apiParam {Number} [maxSuggestions] Maximum number of suggestions (default 10)
 *
 * @apiSuccess {Array} suggestions Array of search suggestions
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse, StatusGeneralError, successResponse } from '@/middleware/crud';
import { searchSuggestionsGet } from '@/services/search';

const querySchema = z.object({
  partialTerm: z.string().min(2).max(100),
  maxSuggestions: z.coerce.number().int().min(1).max(20).optional(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = querySchema.parse(req.query);

    const data = await searchSuggestionsGet(1, validated.partialTerm, validated.maxSuggestions);

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
