import { Router } from 'express';
import { getUser, updateMemo, getMemo } from '../controllers/user.controller.js';

const router = Router();

router.route('/:id').get(getUser);
router.route('/memo').patch(updateMemo);
router.route('/memo').get(getMemo);

export default router;