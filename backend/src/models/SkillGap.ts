import mongoose from 'mongoose';

const skillGapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careerGoal: { type: String, required: true },
  currentSkills: [String],
  requiredSkills: [String],
  skillGaps: [{
    skill: String,
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    recommendations: [{
      type: { type: String, enum: ['course', 'workshop', 'mentor', 'project'] },
      title: String,
      description: String,
      url: String,
      provider: String
    }]
  }],
  suggestedMentors: [{
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchScore: Number,
    reason: String
  }],
  progress: [{
    skill: String,
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'] },
    updatedAt: { type: Date, default: Date.now }
  }],
  lastAnalyzed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

skillGapSchema.index({ user: 1, lastAnalyzed: -1 });

const SkillGap = mongoose.model('SkillGap', skillGapSchema);
export default SkillGap;
