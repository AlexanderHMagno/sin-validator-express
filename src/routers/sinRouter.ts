import { Router } from 'express';
import { validateSin } from '../controllers/sinController';

const router = Router();

router.get('/validate/:sin', validateSin);

export default router;
