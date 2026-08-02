import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Get all notifications for logged-in student
// @route   GET /api/notifications
// @access  Private/Student
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get Notifications Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving notifications.' });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Student
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      studentId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    notification.readStatus = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      notification
    });
  } catch (error) {
    console.error('Mark Read Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error marking notification as read.' });
  }
};

// @desc    Mark all notifications as read
// @route   POST /api/notifications/read-all
// @access  Private/Student
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { studentId: req.user._id, readStatus: false },
      { readStatus: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('Mark All Read Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error marking all notifications as read.' });
  }
};

// @desc    Broadcast a notification to all students
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
export const broadcastNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide a title and a message.' });
    }

    const students = await User.find({ role: 'student' });
    
    const notifications = students.map((student) => ({
      title,
      message,
      studentId: student._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: `Notification broadcasted successfully to ${students.length} students.`
    });
  } catch (error) {
    console.error('Broadcast Notification Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error broadcasting notification.' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Student
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      studentId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Notification Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting notification.' });
  }
};
