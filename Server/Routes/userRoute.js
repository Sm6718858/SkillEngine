import express from 'express';
import { login, signUp } from '../Controller/userController.js';

const router = express.Router();

router.post('/signUp',signUp);
router.post('/login',login);

export default router;