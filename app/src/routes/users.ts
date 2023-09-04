import express from 'express';

import { assignRole } from '../services/user';
import { isAdmin } from '../middlewares/role';

const usersRouter = express.Router();

usersRouter.post('/:userId/role', isAdmin, assignRole);

export default usersRouter;
