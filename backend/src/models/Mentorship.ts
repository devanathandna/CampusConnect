import mongoose from "mongoose";

const mentorshipSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  topic: { type: String, required: true },
  description: String,
  goals: [String],
  sessions: [{
    date: Date,
    duration: Number,
    notes: String,
    completed: Boolean
  }],
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

mentorshipSchema.index({ mentor: 1, mentee: 1, status: 1 });
const Mentorship = mongoose.model('Mentorship', mentorshipSchema);

export default Mentorship;