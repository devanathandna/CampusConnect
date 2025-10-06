import mongoose from 'mongoose';

const knowledgePostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    index: 'text'
  },
  body: { 
    type: String, 
    required: true,
    index: 'text'
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  
  // Categorization
  category: {
    type: String,
    enum: [
      'career-advice',
      'interview-tips',
      'industry-insights',
      'course-guidance',
      'research-tips',
      'networking-strategies',
      'skill-development',
      'job-search',
      'academic-to-industry',
      'other'
    ],
    required: true,
    index: true
  },
  
  // Tags for better searchability
  tags: [{
    type: String,
    index: true
  }],
  
  // Company/Organization (if applicable)
  company: {
    type: String,
    index: true
  },
  
  // Industry
  industry: {
    type: String,
    index: true
  },
  
  // Related skills
  relatedSkills: [{
    type: String,
    index: true
  }],
  
  // Course codes (if applicable)
  courseCodes: [String],
  
  // Suggested mentors who can elaborate
  suggestedMentors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Verification and moderation
  verifiedByAdmin: { 
    type: Boolean, 
    default: false 
  },
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedAt: Date,
  
  // Community curation
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  downvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  voteScore: { 
    type: Number, 
    default: 0,
    index: true
  },
  
  // Engagement metrics
  views: { 
    type: Number, 
    default: 0 
  },
  helpfulCount: { 
    type: Number, 
    default: 0 
  },
  bookmarks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // Comments/Discussion
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  
  // Metadata
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isPinned: { 
    type: Boolean, 
    default: false 
  },
  isEvergreen: { 
    type: Boolean, 
    default: false 
  },
  expiresAt: Date,
  
  // AI-generated metadata
  aiGeneratedTags: [String],
  aiSuggestedSkills: [String],
  aiMatchScore: Number,
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search performance
knowledgePostSchema.index({ 
  title: 'text', 
  body: 'text', 
  tags: 'text',
  company: 'text',
  industry: 'text'
});
knowledgePostSchema.index({ category: 1, voteScore: -1 });
knowledgePostSchema.index({ author: 1, createdAt: -1 });
knowledgePostSchema.index({ relatedSkills: 1 });
knowledgePostSchema.index({ verifiedByAdmin: 1, voteScore: -1 });

// Virtual for net votes
knowledgePostSchema.virtual('netVotes').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Update vote score on save
knowledgePostSchema.pre('save', function(next) {
  this.voteScore = this.upvotes.length - this.downvotes.length;
  next();
});

const KnowledgePost = mongoose.model('KnowledgePost', knowledgePostSchema);

export default KnowledgePost;
