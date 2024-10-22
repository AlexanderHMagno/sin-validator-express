import { Router } from 'express';
import { validateSin } from '../controllers/sinController';
import { rateLimiterMiddleware } from '../middleware/rateLimit';

const router = Router();

router.use(rateLimiterMiddleware);
router.get('/validate/:sin', validateSin);

export default router;
