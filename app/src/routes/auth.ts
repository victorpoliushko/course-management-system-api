import express from 'express';
import passport from 'passport';

import { register } from '../services/auth';
import { login, logout } from '../services/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', passport.authenticate('local'), login);
router.get('/logout', logout);

export default router;
