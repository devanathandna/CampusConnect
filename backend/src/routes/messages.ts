import express, { Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import Message from '../models/Message';
import Notification from '../models/Notification';
import { app, io } from '../server';

app.post('/api/messages', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { to, content, attachments } = req.body;

    // Generate conversation ID
    const conversationId = [req.user._id.toString(), to]
      .sort()
      .join('_');

    const message = new Message({
      from: req.user._id,
      to,
      content,
      attachments: attachments || [],
      conversationId,
      read: false
    });

    await message.save();

    // Emit real-time message via Socket.IO
    io.to(to.toString()).emit('message', {
      ...message.toObject(),
      from: {
        _id: req.user._id,
        profile: req.user.profile
      }
    });

    // Create notification
    await Notification.create({
      user: to,
      type: 'message',
      message: `New message from ${req.user.profile.name}`,
      data: { messageId: message._id, from: req.user._id }
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get conversation
app.get('/api/messages/:userId', isAuthenticated, async (req: any, res: Response) => {
  try {
    const conversationId = [req.user._id.toString(), req.params.userId]
      .sort()
      .join('_');

    const messages = await Message.find({ conversationId })
      .populate('from', 'profile.name profile.avatar')
      .populate('to', 'profile.name profile.avatar')
      .sort({ createdAt: 1 })
      .lean();

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get conversations list
app.get('/api/messages/conversations/list', isAuthenticated, async (req: any, res: Response) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: req.user._id },
            { to: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$lastMessage' }
      },
      {
        $limit: 20
      }
    ]);

    await Message.populate(messages, [
      { path: 'from', select: 'profile.name profile.avatar' },
      { path: 'to', select: 'profile.name profile.avatar' }
    ]);

    res.json({ conversations: messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
app.put('/api/messages/:conversationId/read', isAuthenticated, async (req: any, res: Response) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        to: req.user._id,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});