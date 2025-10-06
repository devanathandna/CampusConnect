import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  // Overall Platform Analytics
  platform: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalConnections: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalMentorships: { type: Number, default: 0 },
    totalGroups: { type: Number, default: 0 }
  },
  
  // User Distribution
  userDistribution: {
    students: { type: Number, default: 0 },
    alumni: { type: Number, default: 0 },
    faculty: { type: Number, default: 0 }
  },
  
  // Engagement Metrics
  engagement: {
    dailyActiveUsers: { type: Number, default: 0 },
    weeklyActiveUsers: { type: Number, default: 0 },
    monthlyActiveUsers: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 }
  },
  
  // Mentorship Analytics
  mentorship: {
    activeMentorships: { type: Number, default: 0 },
    completedMentorships: { type: Number, default: 0 },
    totalMentorshipHours: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    topMentors: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      menteesCount: Number,
      totalHours: Number
    }]
  },
  
  // Event Analytics
  events: {
    totalCreated: { type: Number, default: 0 },
    totalAttendees: { type: Number, default: 0 },
    averageAttendance: { type: Number, default: 0 },
    rsvpRate: { type: Number, default: 0 },
    byCategory: [{
      category: String,
      count: Number,
      averageAttendance: Number
    }]
  },
  
  // Connection Analytics
  connections: {
    studentToAlumni: { type: Number, default: 0 },
    studentToFaculty: { type: Number, default: 0 },
    studentToStudent: { type: Number, default: 0 },
    alumniToAlumni: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 }
  },
  
  // Popular Skills
  popularSkills: [{
    skill: String,
    count: Number,
    trending: Boolean
  }],
  
  // Top Content
  topPosts: [{
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    likes: Number,
    comments: Number,
    shares: Number
  }],
  
  date: { type: Date, default: Date.now, index: true },
  type: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
    index: true
  }
}, { timestamps: true });

analyticsSchema.index({ date: -1, type: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
