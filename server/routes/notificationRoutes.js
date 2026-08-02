import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  broadcastNotification,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Admin routes
router.post('/broadcast', authorize('admin'), broadcastNotification);

// Student routes
router.get('/', authorize('student'), getMyNotifications);
router.put('/:id/read', authorize('student'), markAsRead);
router.post('/read-all', authorize('student'), markAllAsRead);
router.delete('/:id', authorize('student'), deleteNotification);

export default router;
