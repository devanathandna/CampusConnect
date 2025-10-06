import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import Event from '../models/Event';
import Notification from '../models/Notification';

const router = Router();

// Create event
router.post('/', isAuthenticated, async (req: any, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get events
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query: any = { isPublished: true };

    if (category) query.category = category;
    if (startDate) query.startDate = { $gte: new Date(startDate as string) };
    if (endDate) query.endDate = { $lte: new Date(endDate as string) };

    const events = await Event.find(query)
      .populate('organizer', 'profile.name profile.avatar')
      .sort({ startDate: 1 })
      .lean();

    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// RSVP to event
router.post('/:id/rsvp', isAuthenticated, async (req: any, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.attendees.some(
      (a: any) => a.user.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Check max attendees
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ error: 'Event is full' });
    }

    event.attendees.push({
      user: req.user._id,
      rsvpDate: new Date(),
      attended: false
    });

    await event.save();

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'event_reminder',
      message: `You're registered for ${event.title}`,
      data: { eventId: event._id }
    });

    res.json({ message: 'RSVP successful', event });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit event feedback
router.post('/:id/feedback', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.feedback.push({
      user: req.user._id,
      rating,
      comment,
      createdAt: new Date()
    });

    await event.save();

    res.json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
