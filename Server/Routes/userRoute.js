import express from 'express';
import { getUserProfile, login, Logout, signUp } from '../Controller/userController.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

const router = express.Router();

router.post('/signUp',signUp);
router.post('/login',login);
router.get('/logout',Logout);
router.get('/profile',isAuthenticated,getUserProfile);

export default router;