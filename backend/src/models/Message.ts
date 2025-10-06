import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  conversationId: { type: String, required: true, index: true },
  attachments: [{
    type: String,
    url: String,
    name: String
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: -1 });
const Message = mongoose.model('Message', messageSchema);

export default Message;