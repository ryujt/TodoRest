const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');

const usersStore = new DataStore('users.jsonl');

// Get all users with pagination
router.get('/', (req, res) => {
  try {
    const { page, limit, role, status, search, sortBy, sortOrder } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) filter.search = search;
    if (sortBy) {
      filter.sortBy = sortBy;
      filter.sortOrder = sortOrder || 'asc';
    }

    if (page || limit) {
      const result = usersStore.paginate(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        filter
      );
      return res.json(result);
    }

    const users = usersStore.read();
    res.json({ data: users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
router.post('/', (req, res) => {
  try {
    const { username, email, name, role, avatar, bio } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    // Check if username or email already exists
    const users = usersStore.read();
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = usersStore.create({
      username,
      email,
      name: name || '',
      role: role || 'user',
      avatar: avatar || `https://i.pravatar.cc/150?u=${username}`,
      bio: bio || '',
      status: 'active'
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:id', (req, res) => {
  try {
    const user = usersStore.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', (req, res) => {
  try {
    const { username, email, name, role, avatar, bio, status } = req.body;

    const updated = usersStore.update(req.params.id, {
      username,
      email,
      name,
      role,
      avatar,
      bio,
      status
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  try {
    const deleted = usersStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
