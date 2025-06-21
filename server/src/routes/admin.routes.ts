import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';

const router = Router();

router.get('/test', protect, isAdmin, (req, res) => {
  res.json({ message: 'Admin route accessed successfully' });
});

export default router;
