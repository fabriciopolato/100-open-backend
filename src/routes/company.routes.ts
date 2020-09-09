import { Router } from 'express';
import CompanyControllers from '../controllers/companyControllers';
import authenticate from '../middlewares/authentication';

const router = Router();
const companyControllers = new CompanyControllers();

router.post('/', companyControllers.create);
router.get('/', companyControllers.show);
router.put('/:id', companyControllers.update);
router.put('/vote/:id', authenticate, companyControllers.updateActivity);

export default router;
