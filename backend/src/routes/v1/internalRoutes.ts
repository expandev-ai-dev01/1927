import { Router } from 'express';
import * as searchController from '@/api/v1/internal/search/controller';
import * as searchProductsController from '@/api/v1/internal/search/products/controller';
import * as searchSuggestionsController from '@/api/v1/internal/search/suggestions/controller';
import * as searchHistoryController from '@/api/v1/internal/search/history/controller';
import * as searchFilterOptionsController from '@/api/v1/internal/search/filter-options/controller';

const router = Router();

// Search routes
router.get('/search/products', searchProductsController.getHandler);
router.get('/search/suggestions', searchSuggestionsController.getHandler);
router.post('/search/history', searchController.postHandler);
router.get('/search/history', searchHistoryController.getHandler);
router.get('/search/filter-options', searchFilterOptionsController.getHandler);

export default router;
