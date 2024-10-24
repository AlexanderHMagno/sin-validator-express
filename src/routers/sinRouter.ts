import { Router } from 'express';
import { validateSin, validateNextSin } from '../controllers/sinController';
import { rateLimiterMiddleware } from '../middleware/rateLimit';

const router = Router();

router.use(rateLimiterMiddleware);
router.get('/validate/:sin', validateSin);
router.get('/validate-next/:sin', validateNextSin);

export default router;
