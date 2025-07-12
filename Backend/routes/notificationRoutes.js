import express from 'express';
import {
  getRecentNotifications,
  getUnreadNotificationCount,
  markNotificationsRead
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getRecentNotifications);
router.get('/unread-count', authMiddleware, getUnreadNotificationCount);
router.post('/mark-read', authMiddleware, markNotificationsRead);

export default router;
