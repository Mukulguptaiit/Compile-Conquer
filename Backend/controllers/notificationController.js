import db from '../models/index.js';

export const getRecentNotifications = async (req, res) => {
  try {
    const notifications = await db.models.Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await db.models.Notification.count({
      where: { userId: req.user.id, isRead: false }
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await db.models.Notification.update(
      { isRead: true },
      {
        where: {
          id: notificationIds,
          userId: req.user.id
        }
      }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
