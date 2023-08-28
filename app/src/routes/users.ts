import express from 'express';

import { assignRole } from '../services/user';
import { isAdmin } from '../middlewares/role';

const router = express.Router();

router.post('/users/:userId/role', isAdmin, assignRole);

export default router;
