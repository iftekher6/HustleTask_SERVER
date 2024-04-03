import express from 'express';
import { User } from '../models/user.js'; 
import {getUserProfile, login, logout, registerUser} from '../contorllers/user.js';
import { isAuthenticated } from '../middlewars/auth.js';

const router = express.Router();


router.post('/login', login);
router.get('/logout', logout);

router.post('/register', registerUser);

router.get('/userProfile', isAuthenticated, getUserProfile);

export default router;

