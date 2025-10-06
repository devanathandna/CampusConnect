import express, { Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import Mentorship from '../models/Mentorship';
import Notification from '../models/Notification';
import { app,io } from '../server';

app.post('/api/mentorship/request', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { mentor, topic, description, goals } = req.body;

    const mentorship = new Mentorship({
      mentor,
      mentee: req.user._id,
      topic,
      description,
      goals: goals || [],
      status: 'pending'
    });

    await mentorship.save();

    // Create notification
    await Notification.create({
      user: mentor,
      type: 'mentorship_request',
      message: `${req.user.profile.name} requested mentorship`,
      data: { mentorshipId: mentorship._id }
    });

    io.to(mentor.toString()).emit('notification', {
      type: 'mentorship_request',
      data: mentorship
    });

    res.status(201).json({ message: 'Mentorship request sent', mentorship });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept/Update mentorship
app.put('/api/mentorship/:id', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { status, startDate, endDate } = req.body;

    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) {
      return res.status(404).json({ error: 'Mentorship not found' });
    }

    if (mentorship.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (status) mentorship.status = status;
    if (startDate) mentorship.startDate = startDate;
    if (endDate) mentorship.endDate = endDate;

    await mentorship.save();

    res.json({ message: 'Mentorship updated', mentorship });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get mentorship requests
app.get('/api/mentorship/requests', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { role } = req.query;
    const query: any = { status: 'pending' };

    if (role === 'mentor') {
      query.mentor = req.user._id;
    } else {
      query.mentee = req.user._id;
    }

    const requests = await Mentorship.find(query)
      .populate('mentor', 'profile.name profile.avatar role')
      .populate('mentee', 'profile.name profile.avatar role')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get active mentorships
app.get('/api/mentorship/active', isAuthenticated, async (req: any, res: Response) => {
  try {
    const mentorships = await Mentorship.find({
      $or: [{ mentor: req.user._id }, { mentee: req.user._id }],
      status: 'active'
    })
      .populate('mentor', 'profile.name profile.avatar role')
      .populate('mentee', 'profile.name profile.avatar role');

    res.json({ mentorships });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});