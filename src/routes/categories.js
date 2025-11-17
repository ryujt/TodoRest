const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');

const categoriesStore = new DataStore('categories.jsonl');

// Get all categories
router.get('/', (req, res) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query;

    const filter = {};
    if (search) filter.search = search;
    if (sortBy) {
      filter.sortBy = sortBy;
      filter.sortOrder = sortOrder || 'asc';
    }

    if (page || limit) {
      const result = categoriesStore.paginate(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        filter
      );
      return res.json(result);
    }

    const categories = categoriesStore.read();
    res.json({ data: categories, total: categories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new category
router.post('/', (req, res) => {
  try {
    const { name, description, slug, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if slug already exists
    const categories = categoriesStore.read();
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    if (categories.some(c => c.slug === categorySlug)) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const newCategory = categoriesStore.create({
      name,
      description: description || '',
      slug: categorySlug,
      color: color || '#' + Math.floor(Math.random()*16777215).toString(16),
      postCount: 0
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single category
router.get('/:id', (req, res) => {
  try {
    const category = categoriesStore.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update category
router.put('/:id', (req, res) => {
  try {
    const { name, description, color } = req.body;

    const updated = categoriesStore.update(req.params.id, {
      name,
      description,
      color
    });

    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category
router.delete('/:id', (req, res) => {
  try {
    const deleted = categoriesStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
