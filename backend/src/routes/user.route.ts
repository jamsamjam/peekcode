import { Router } from 'express';
import { getUser } from '../controllers/user.controller.js';

const router = Router();

router.route('/user/:id').post(getUser);

export default router;