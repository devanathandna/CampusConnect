import { Router, Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import Post from '../models/Post';
import User from '../models/User';
import Notification from '../models/Notification';

const router = Router();
let io: any;

export const setSocketIO = (socketIO: any) => {
  io = socketIO;
};

// Create post
router.post('/', isAuthenticated, async (req: any, res: Response) => {
  try {
    const post = new Post({
      author: req.user._id,
      content: req.body.content,
      type: req.body.type || 'update',
      attachments: req.body.attachments || [],
      visibility: req.body.visibility || 'public'
    });

    await post.save();
    await post.populate('author', 'profile.name profile.avatar role');

    // Emit to connections
    io.emit('new_post', post);

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feed
router.get('/feed', isAuthenticated, async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    const connectionIds = user?.connections || [];

    const posts = await Post.find({
      $or: [
        { visibility: 'public', isActive: true },
        { author: { $in: [...connectionIds, req.user._id] }, isActive: true }
      ]
    })
      .populate('author', 'profile.name profile.avatar role')
      .populate('comments.user', 'profile.name profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ posts, page, hasMore: posts.length === limit });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like post
router.post('/:id/like', isAuthenticated, async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
      
      // Create notification
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: post.author,
          type: 'post_like',
          message: `${req.user.profile.name} liked your post`,
          data: { postId: post._id }
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Comment on post
router.post('/:id/comment', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content,
      createdAt: new Date()
    });

    await post.save();

    // Create notification
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'post_comment',
        message: `${req.user.profile.name} commented on your post`,
        data: { postId: post._id }
      });
    }

    await post.populate('comments.user', 'profile.name profile.avatar');
    res.json({ comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;