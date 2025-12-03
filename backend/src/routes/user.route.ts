import { Router } from 'express';
import { getUser, createMemo, getMemo } from '../controllers/user.controller.js';

const router = Router();

router.route('/user/:id').get(getUser);
router.route('/user/memo/').patch(createMemo);
router.route('/user/memo/').get(getMemo);

export default router;