import { Router } from 'express';
import { getUser } from '../controllers/user.controller.js';

const router = Router();

router.route('/user/:id').get(getUser);

export default router;