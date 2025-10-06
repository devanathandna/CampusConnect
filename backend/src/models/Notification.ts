import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: [
      'connection_request', 
      'connection_accepted',
      'message', 
      'event_reminder',
      'event_invitation',
      'event_update',
      'event_cancelled',
      'endorsement',
      'mentorship_request',
      'mentorship_accepted',
      'mentorship_session',
      'post_like',
      'post_comment',
      'post_share',
      'group_invitation',
      'group_request',
      'badge_earned',
      'level_up',
      'announcement'
    ],
    required: true,
    index: true
  },
  title: String,
  message: String,
  data: mongoose.Schema.Types.Mixed,
  read: { type: Boolean, default: false },
  actionUrl: String,
  createdAt: { type: Date, default: Date.now, index: true }
});

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;