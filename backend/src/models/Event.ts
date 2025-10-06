import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Career', 'Academic', 'Cultural', 'Networking', 'Workshop', 'Other'],
    required: true,
    index: true
  },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  isVirtual: { type: Boolean, default: false },
  virtualLink: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rsvpDate: { type: Date, default: Date.now },
    attended: { type: Boolean, default: false }
  }],
  maxAttendees: Number,
  tags: [String],
  imageUrl: String,
  isPublished: { type: Boolean, default: true },
  feedback: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

eventSchema.index({ startDate: 1, category: 1 });
const Event = mongoose.model('Event', eventSchema);

export default Event;