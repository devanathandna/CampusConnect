import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'alumni', 'faculty'], 
    required: true,
    index: true 
  },
  profile: {
    name: { type: String, required: true },
    avatar: String,
    bio: String,
    major: String,
    graduationYear: String,
    company: String,
    department: String,
    skills: [String],
    interests: [String],
    location: String,
    linkedinUrl: String,
    githubUrl: String
  },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  endorsements: [{
    skill: String,
    endorsedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'connections', 'private'], default: 'public' },
    showEmail: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add text index for search
userSchema.index({ 
  'profile.name': 'text', 
  'profile.skills': 'text', 
  'profile.bio': 'text' 
});

const User = mongoose.model('User', userSchema);
export default User;