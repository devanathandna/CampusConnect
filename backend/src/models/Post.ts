import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['update', 'opportunity', 'achievement', 'question'],
    default: 'update'
  },
  attachments: [{
    type: String,
    url: String
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  visibility: { type: String, enum: ['public', 'connections'], default: 'public' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

postSchema.index({ author: 1, createdAt: -1 });
const Post = mongoose.model('Post', postSchema);

export default Post;