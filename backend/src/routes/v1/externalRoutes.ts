import { Router } from 'express';
import * as searchController from '@/api/v1/external/public/search/controller';

const router = Router();

router.post('/public/search', searchController.postHandler);
router.get('/public/search/autocomplete', searchController.getAutocompleteHandler);
router.get('/public/search/filter-options', searchController.getFilterOptionsHandler);
router.get('/public/search/alternatives', searchController.getAlternativesHandler);

export default router;
