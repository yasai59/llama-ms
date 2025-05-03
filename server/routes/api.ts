import express from 'express';
import { updateHandler } from '../helpers/update';
import { getRecommendationsHandler } from '../helpers/getRecommendations';
import { getAiAssistedInvestmentsHandler } from '../helpers/getAiAssistedInvestments';
import { getAssetRecommendationHandler } from '../helpers/getAssetRecommendation';
import { verifyApiKey } from '../middlewares/verifyApiKey';

const router = express.Router();

router.post('/update', [verifyApiKey], updateHandler);
router.get('/get_recommendations', [verifyApiKey], getRecommendationsHandler);
router.get('/get_ai_assisted_investments', [verifyApiKey], getAiAssistedInvestmentsHandler);
router.get('/get_asset_recommendation', [verifyApiKey], getAssetRecommendationHandler);

export default router;