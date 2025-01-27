const Post = require('../models/postModel');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      author: req.userData.userId,
    });
    console.log('Post:', post);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

// Get all posts with search and pagination
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updates = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    };

    const post = await Post.findOneAndUpdate(
      { _id: postId, author: req.userData.userId }, 
      { $set: updates },
      { new: true, omitUndefined: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found or not authorized' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {

  try {
    const postId = req.params.id;

    const post = await Post.findOneAndDelete({
      _id: postId,
      // author: req.userData.userId,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or not authorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};
