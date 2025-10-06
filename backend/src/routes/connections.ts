import express, { Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import User from '../models/User';
import Connection from '../models/Connection';
import Notification from '../models/Notification';
import { app,io } from '../server';

app.post('/api/connections/request', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { to, message } = req.body;

    // Check if connection already exists
    const existing = await Connection.findOne({
      $or: [
        { from: req.user._id, to },
        { from: to, to: req.user._id }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }

    const connection = new Connection({
      from: req.user._id,
      to,
      message,
      status: 'pending'
    });

    await connection.save();

    // Create notification
    await Notification.create({
      user: to,
      type: 'connection_request',
      message: `${req.user.profile.name} sent you a connection request`,
      data: { connectionId: connection._id, from: req.user._id }
    });

    // Emit real-time notification via Socket.IO
    io.to(to.toString()).emit('notification', {
      type: 'connection_request',
      data: connection
    });

    res.json({ message: 'Connection request sent', connection });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept/Reject connection
app.put('/api/connections/:id', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { status } = req.body;

    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (connection.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    connection.status = status;
    await connection.save();

    if (status === 'accepted') {
      // Add to both users' connections
      await User.findByIdAndUpdate(connection.from, {
        $addToSet: { connections: connection.to }
      });
      await User.findByIdAndUpdate(connection.to, {
        $addToSet: { connections: connection.from }
      });

      // Create notification
      await Notification.create({
        user: connection.from,
        type: 'connection_accepted',
        message: `${req.user.profile.name} accepted your connection request`,
        data: { userId: req.user._id }
      });

      io.to(connection.from.toString()).emit('notification', {
        type: 'connection_accepted',
        data: connection
      });
    }

    res.json({ message: `Connection ${status}`, connection });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user connections
app.get('/api/connections', isAuthenticated, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('connections', 'profile.name profile.avatar role profile.company profile.major');
    
    res.json({ connections: user?.connections || [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending connection requests
app.get('/api/connections/pending', isAuthenticated, async (req: any, res: Response) => {
  try {
    const requests = await Connection.find({
      to: req.user._id,
      status: 'pending'
    }).populate('from', 'profile.name profile.avatar role');

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});