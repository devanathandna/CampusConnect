import { Router, Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import KnowledgePost from '../models/KnowledgePost';
import User from '../models/User';
import Notification from '../models/Notification';

const router = Router();

// Create knowledge post (Alumni/Faculty only)
router.post('/', isAuthenticated, async (req: any, res: Response) => {
  try {
    // Check if user is alumni or faculty
    if (req.user.role === 'student') {
      return res.status(403).json({ 
        error: 'Only alumni and faculty can create knowledge posts' 
      });
    }

    const {
      title,
      body,
      category,
      tags,
      company,
      industry,
      relatedSkills,
      courseCodes,
      isEvergreen
    } = req.body;

    if (!title || !body || !category) {
      return res.status(400).json({ 
        error: 'Title, body, and category are required' 
      });
    }

    const knowledgePost = new KnowledgePost({
      title,
      body,
      author: req.user._id,
      category,
      tags: tags || [],
      company,
      industry,
      relatedSkills: relatedSkills || [],
      courseCodes: courseCodes || [],
      isEvergreen: isEvergreen || false
    });

    // AI-powered tag extraction (simplified - would use NLP service)
    if (body && relatedSkills) {
      knowledgePost.aiSuggestedSkills = relatedSkills.slice(0, 5);
    }

    await knowledgePost.save();
    await knowledgePost.populate('author', 'profile.name profile.avatar role');

    // Award points for contribution
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'gamification.points': 50 }
    });

    res.status(201).json({ 
      message: 'Knowledge post created successfully', 
      post: knowledgePost 
    });
  } catch (error) {
    console.error('Create knowledge post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search knowledge posts (The "Needle-in-a-Haystack" Search)
router.get('/search', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { 
      q, 
      category, 
      company, 
      industry, 
      skill, 
      courseCode,
      verified,
      evergreen,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    const query: any = { isActive: true };

    // Full-text search
    if (q) {
      query.$text = { $search: q as string };
    }

    // Filters
    if (category) query.category = category;
    if (company) query.company = new RegExp(company as string, 'i');
    if (industry) query.industry = new RegExp(industry as string, 'i');
    if (skill) query.relatedSkills = skill;
    if (courseCode) query.courseCodes = courseCode;
    if (verified === 'true') query.verifiedByAdmin = true;
    if (evergreen === 'true') query.isEvergreen = true;

    // Sorting
    let sort: any = {};
    switch (sortBy) {
      case 'recent':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { voteScore: -1, views: -1 };
        break;
      case 'helpful':
        sort = { helpfulCount: -1 };
        break;
      default:
        sort = q ? { score: { $meta: 'textScore' } } : { voteScore: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const posts = await KnowledgePost.find(query)
      .populate('author', 'profile.name profile.avatar role profile.company profile.department')
      .populate('suggestedMentors', 'profile.name profile.avatar role')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await KnowledgePost.countDocuments(query);

    res.json({ 
      posts, 
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Search knowledge posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single knowledge post
router.get('/:id', isAuthenticated, async (req: any, res: Response) => {
  try {
    const post = await KnowledgePost.findById(req.params.id)
      .populate('author', 'profile.name profile.avatar role profile.company profile.department profile.bio')
      .populate('suggestedMentors', 'profile.name profile.avatar role profile.skills')
      .populate('comments.user', 'profile.name profile.avatar role');

    if (!post) {
      return res.status(404).json({ error: 'Knowledge post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (error) {
    console.error('Get knowledge post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upvote/Downvote knowledge post
router.post('/:id/vote', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    
    const post = await KnowledgePost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user._id;
    const upvoteIndex = post.upvotes.indexOf(userId);
    const downvoteIndex = post.downvotes.indexOf(userId);

    // Remove existing votes
    if (upvoteIndex > -1) post.upvotes.splice(upvoteIndex, 1);
    if (downvoteIndex > -1) post.downvotes.splice(downvoteIndex, 1);

    // Add new vote
    if (voteType === 'up') {
      post.upvotes.push(userId);
    } else if (voteType === 'down') {
      post.downvotes.push(userId);
    }

    await post.save();

    res.json({ 
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
      voteScore: post.voteScore
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark as helpful
router.post('/:id/helpful', isAuthenticated, async (req: any, res: Response) => {
  try {
    const post = await KnowledgePost.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Award points to author
    await User.findByIdAndUpdate(post.author, {
      $inc: { 'gamification.points': 5 }
    });

    res.json({ helpfulCount: post.helpfulCount });
  } catch (error) {
    console.error('Helpful error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bookmark knowledge post
router.post('/:id/bookmark', isAuthenticated, async (req: any, res: Response) => {
  try {
    const post = await KnowledgePost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user._id;
    const bookmarkIndex = post.bookmarks.indexOf(userId);

    if (bookmarkIndex > -1) {
      // Remove bookmark
      post.bookmarks.splice(bookmarkIndex, 1);
    } else {
      // Add bookmark
      post.bookmarks.push(userId);
    }

    await post.save();

    res.json({ 
      bookmarked: bookmarkIndex === -1,
      bookmarkCount: post.bookmarks.length
    });
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to knowledge post
router.post('/:id/comment', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const post = await KnowledgePost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content,
      createdAt: new Date(),
      upvotes: []
    });

    await post.save();

    // Notify author
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'knowledge_comment',
        message: `${req.user.profile.name} commented on your knowledge post`,
        data: { knowledgePostId: post._id }
      });
    }

    await post.populate('comments.user', 'profile.name profile.avatar role');

    res.json({ comments: post.comments });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify post (Admin/Faculty only)
router.post('/:id/verify', isAuthenticated, async (req: any, res: Response) => {
  try {
    // Check if user is faculty or admin
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const post = await KnowledgePost.findByIdAndUpdate(
      req.params.id,
      {
        verifiedByAdmin: true,
        verifiedBy: req.user._id,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Award bonus points to author for verified post
    await User.findByIdAndUpdate(post.author, {
      $inc: { 'gamification.points': 25 }
    });

    res.json({ message: 'Post verified successfully', post });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's bookmarked posts
router.get('/user/bookmarks', isAuthenticated, async (req: any, res: Response) => {
  try {
    const posts = await KnowledgePost.find({
      bookmarks: req.user._id,
      isActive: true
    })
      .populate('author', 'profile.name profile.avatar role')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ posts });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trending knowledge posts
router.get('/trending', isAuthenticated, async (req: any, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await KnowledgePost.find({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo }
    })
      .populate('author', 'profile.name profile.avatar role')
      .sort({ views: -1, voteScore: -1 })
      .limit(10)
      .lean();

    res.json({ posts });
  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
