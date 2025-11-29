import { Router } from 'express';
import { createProblem, getProblems, updateProblem, deleteProblem } from '../controllers/problem.controller.js';

const router = Router();

router.route('/create').post(createProblem);
router.route('/getProblems').get(getProblems);
router.route('/update/:id').patch(updateProblem);
router.route('/delete/:id').delete(deleteProblem);

export default router;