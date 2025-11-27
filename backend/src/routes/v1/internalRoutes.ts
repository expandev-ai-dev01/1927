import { Router } from 'express';
import * as searchController from '@/api/v1/internal/search/controller';
import * as searchHistoryController from '@/api/v1/internal/search/history/controller';

const router = Router();

// Search routes
router.get('/search/products', searchController.searchProductsHandler);
router.get('/search/filter-options', searchController.getFilterOptionsHandler);
router.get('/search/suggestions', searchController.getSuggestionsHandler);

// Search history routes
router.get('/search/history', searchHistoryController.listHandler);
router.post('/search/history', searchHistoryController.createHandler);

export default router;
