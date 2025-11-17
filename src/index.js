const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
const todosRouter = require('./routes/todos');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const categoriesRouter = require('./routes/categories');

app.use('/api/todos', todosRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/categories', categoriesRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TodoRest API',
    version: '2.0.0',
    endpoints: {
      todos: '/api/todos',
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments',
      categories: '/api/categories'
    },
    features: [
      'Pagination (use ?page=1&limit=10)',
      'Filtering (use resource-specific filters)',
      'Searching (use ?search=keyword)',
      'Sorting (use ?sortBy=field&sortOrder=asc|desc)'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     TodoRest API Server v2.0.0         ║
║                                        ║
║  Server running on port ${PORT}           ║
║  http://localhost:${PORT}                 ║
║                                        ║
║  Available endpoints:                  ║
║    GET  /                              ║
║    *    /api/todos                     ║
║    *    /api/users                     ║
║    *    /api/posts                     ║
║    *    /api/comments                  ║
║    *    /api/categories                ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
