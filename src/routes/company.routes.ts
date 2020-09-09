import { Router } from 'express';
import CompanyControllers from '../controllers/companyControllers';
import authenticate from '../middlewares/authentication';

const router = Router();
const companyControllers = new CompanyControllers();

router.use(authenticate);

router.post('/', companyControllers.create);
router.get('/', companyControllers.show);
router.put('/:id', companyControllers.update);
router.put('/vote/:id', companyControllers.updateActivity);

export default router;
