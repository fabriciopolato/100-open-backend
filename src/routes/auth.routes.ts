import { Router } from 'express';
import UserControllers from '../controllers/userControllers';

const router = Router();
const userControllers = new UserControllers();

router.post('/signup', userControllers.create);
router.post('/login', userControllers.login);

export default router;
