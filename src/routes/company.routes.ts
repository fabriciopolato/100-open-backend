import { Router } from 'express';
import CompanyControllers from '../controllers/companyControllers';

const router = Router();
const companyControllers = new CompanyControllers();

router.post('/', companyControllers.create);
router.get('/', companyControllers.show);
router.put('/:id', companyControllers.update);

export default router;