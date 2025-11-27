import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { searchHistoryCreate, searchHistoryList } from '@/services/search';

const securable = 'SEARCH';

/**
 * @api {get} /internal/search/history List Search History
 * @apiName ListSearchHistory
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves the most recent search history for the user (last 10 searches)
 *
 * @apiSuccess {Array} history List of recent searches with terms, filters, and result counts
 *
 * @apiError {String} UnauthorizedError User lacks permission
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, z.object({}));

  if (!validated) {
    return next(error);
  }

  try {
    const data = await searchHistoryList({
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
 * @api {post} /internal/search/history Create Search History
 * @apiName CreateSearchHistory
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiDescription Records a search operation in the history for analytics
 *
 * @apiParam {String} searchTerm Search term entered by user
 * @apiParam {String} [filters] JSON string of applied filters
 * @apiParam {Number} resultCount Number of results returned
 *
 * @apiSuccess {Object} searchHistory Created search history record
 *
 * @apiError {String} searchTermRequired Search term is required
 * @apiError {String} resultCountRequired Result count is required
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    searchTerm: z.string().min(1).max(100),
    filters: z.string().max(5000).nullable().optional(),
    resultCount: z.number().int().nonnegative(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await searchHistoryCreate({
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
