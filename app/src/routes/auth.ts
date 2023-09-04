import express from 'express';
import passport from 'passport';

import { register } from '../services/auth';
import { login, logout } from '../services/auth';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', passport.authenticate('local'), login);
authRouter.get('/logout', logout);

export default authRouter;
