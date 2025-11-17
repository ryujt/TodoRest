const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');

const postsStore = new DataStore('posts.jsonl');

// Get all posts with pagination and filtering
router.get('/', (req, res) => {
  try {
    const { page, limit, authorId, categoryId, status, search, sortBy, sortOrder } = req.query;

    const filter = {};
    if (authorId) filter.authorId = authorId;
    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;
    if (search) filter.search = search;
    if (sortBy) {
      filter.sortBy = sortBy;
      filter.sortOrder = sortOrder || 'desc';
    }

    if (page || limit) {
      const result = postsStore.paginate(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        filter
      );
      return res.json(result);
    }

    const posts = postsStore.read();
    res.json({ data: posts, total: posts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new post
router.post('/', (req, res) => {
  try {
    const { title, content, authorId, categoryId, tags, status } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required' });
    }

    const newPost = postsStore.create({
      title,
      content,
      authorId,
      categoryId: categoryId || null,
      tags: tags || [],
      status: status || 'published',
      viewCount: 0,
      likeCount: 0
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', (req, res) => {
  try {
    const post = postsStore.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.viewCount = (post.viewCount || 0) + 1;
    postsStore.update(req.params.id, { viewCount: post.viewCount });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', (req, res) => {
  try {
    const { title, content, categoryId, tags, status } = req.body;

    const updated = postsStore.update(req.params.id, {
      title,
      content,
      categoryId,
      tags,
      status
    });

    if (!updated) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike post
router.patch('/:id/like', (req, res) => {
  try {
    const post = postsStore.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updated = postsStore.update(req.params.id, {
      likeCount: (post.likeCount || 0) + 1
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', (req, res) => {
  try {
    const deleted = postsStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
