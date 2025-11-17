const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');

const todosStore = new DataStore('todos.jsonl');

// Get all todos with pagination and filtering
router.get('/', (req, res) => {
  try {
    const { page, limit, completed, priority, search, sortBy, sortOrder } = req.query;

    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (search) filter.search = search;
    if (sortBy) {
      filter.sortBy = sortBy;
      filter.sortOrder = sortOrder || 'asc';
    }

    if (page || limit) {
      const result = todosStore.paginate(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        filter
      );
      return res.json(result);
    }

    const todos = todosStore.read();
    res.json({ data: todos, total: todos.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new todo
router.post('/', (req, res) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = todosStore.create({
      title,
      description: description || '',
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || []
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single todo
router.get('/:id', (req, res) => {
  try {
    const todo = todosStore.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update todo
router.put('/:id', (req, res) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;

    const updated = todosStore.update(req.params.id, {
      title,
      description,
      priority,
      dueDate,
      tags
    });

    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle completed status
router.patch('/:id', (req, res) => {
  try {
    const todo = todosStore.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updated = todosStore.update(req.params.id, {
      completed: !todo.completed
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete todo
router.delete('/:id', (req, res) => {
  try {
    const deleted = todosStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
