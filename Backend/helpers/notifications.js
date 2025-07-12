import db from '../models/index.js';

export const createNotification = async (userId, type, content) => {
  if (!userId || !type || !content) return;
  try {
    await db.models.Notification.create({
      userId,
      type,
      content,
      isRead: false
    });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};
