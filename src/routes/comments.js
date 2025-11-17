const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');

const commentsStore = new DataStore('comments.jsonl');

// Get all comments with pagination and filtering
router.get('/', (req, res) => {
  try {
    const { page, limit, postId, authorId, search, sortBy, sortOrder } = req.query;

    const filter = {};
    if (postId) filter.postId = postId;
    if (authorId) filter.authorId = authorId;
    if (search) filter.search = search;
    if (sortBy) {
      filter.sortBy = sortBy;
      filter.sortOrder = sortOrder || 'desc';
    }

    if (page || limit) {
      const result = commentsStore.paginate(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        filter
      );
      return res.json(result);
    }

    const comments = commentsStore.read();
    res.json({ data: comments, total: comments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new comment
router.post('/', (req, res) => {
  try {
    const { postId, authorId, content, parentId } = req.body;

    if (!postId || !authorId || !content) {
      return res.status(400).json({ error: 'PostId, authorId, and content are required' });
    }

    const newComment = commentsStore.create({
      postId,
      authorId,
      content,
      parentId: parentId || null,
      likeCount: 0
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single comment
router.get('/:id', (req, res) => {
  try {
    const comment = commentsStore.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update comment
router.put('/:id', (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const updated = commentsStore.update(req.params.id, { content });

    if (!updated) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike comment
router.patch('/:id/like', (req, res) => {
  try {
    const comment = commentsStore.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updated = commentsStore.update(req.params.id, {
      likeCount: (comment.likeCount || 0) + 1
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id', (req, res) => {
  try {
    const deleted = commentsStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
