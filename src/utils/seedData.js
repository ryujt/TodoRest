const DataStore = require('./dataStore');

const usersStore = new DataStore('users.jsonl');
const categoriesStore = new DataStore('categories.jsonl');
const postsStore = new DataStore('posts.jsonl');
const commentsStore = new DataStore('comments.jsonl');
const todosStore = new DataStore('todos.jsonl');

// Sample data generators
const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Ava', 'Richard', 'Sophia', 'Thomas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson'];

const categories = [
  { name: 'Technology', description: 'All about tech and programming', slug: 'technology', color: '#3b82f6' },
  { name: 'Lifestyle', description: 'Daily life and wellness', slug: 'lifestyle', color: '#ef4444' },
  { name: 'Travel', description: 'Adventures around the world', slug: 'travel', color: '#10b981' },
  { name: 'Food', description: 'Recipes and restaurant reviews', slug: 'food', color: '#f59e0b' },
  { name: 'Business', description: 'Entrepreneurship and business tips', slug: 'business', color: '#6366f1' },
  { name: 'Education', description: 'Learning and development', slug: 'education', color: '#8b5cf6' },
  { name: 'Health', description: 'Health and fitness', slug: 'health', color: '#ec4899' },
  { name: 'Entertainment', description: 'Movies, music, and games', slug: 'entertainment', color: '#14b8a6' }
];

const postTitles = [
  'Getting Started with Node.js',
  'The Ultimate Guide to REST APIs',
  'Top 10 Travel Destinations for 2024',
  'Healthy Breakfast Ideas',
  'How to Build a Successful Startup',
  'Best Practices for Remote Work',
  'Understanding Machine Learning Basics',
  'The Art of Minimalist Living',
  'Photography Tips for Beginners',
  'Mastering Time Management',
  'Introduction to Docker Containers',
  'Sustainable Living in Modern Cities',
  'The Future of Web Development',
  'Mediterranean Diet Benefits',
  'Building Better User Interfaces',
  'Mental Health in the Digital Age',
  'Exploring European Cities',
  'The Science of Productivity',
  'Modern JavaScript Features',
  'Home Workout Routines'
];

const todoTitles = [
  'Complete project documentation',
  'Review pull requests',
  'Update dependencies',
  'Write unit tests',
  'Fix authentication bug',
  'Optimize database queries',
  'Design new landing page',
  'Implement search feature',
  'Schedule team meeting',
  'Prepare presentation',
  'Research new technologies',
  'Refactor legacy code',
  'Deploy to production',
  'Update API documentation',
  'Create backup system',
  'Set up CI/CD pipeline',
  'Conduct code review',
  'Analyze performance metrics',
  'Plan sprint tasks',
  'Write blog post'
];

const commentTexts = [
  'Great article! Very informative.',
  'Thanks for sharing this. It really helped me.',
  'I have a question about this approach.',
  'This is exactly what I was looking for!',
  'Could you provide more details on this?',
  'Interesting perspective. I never thought about it that way.',
  'Well written and easy to understand.',
  'I disagree with some points, but overall good content.',
  'This tutorial saved me hours of work. Thank you!',
  'Looking forward to more content like this.',
  'Very practical and actionable advice.',
  'I tried this and it worked perfectly!',
  'Could you make a follow-up post on this topic?',
  'This is a game changer for my workflow.',
  'Clear explanations and good examples.'
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateUsers(count = 20) {
  console.log(`Generating ${count} users...`);
  const users = [];
  const roles = ['user', 'admin', 'moderator', 'user', 'user']; // More users than admins

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
    const email = `${username}@example.com`;

    const user = {
      id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
      username,
      email,
      name: `${firstName} ${lastName}`,
      role: randomElement(roles),
      avatar: `https://i.pravatar.cc/150?u=${username}`,
      bio: `Software developer and tech enthusiast. Love coding and learning new things.`,
      status: 'active',
      createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(user);
  }

  usersStore.write(users);
  console.log(`✓ Created ${count} users`);
  return users;
}

function generateCategories() {
  console.log('Generating categories...');
  const categoryData = categories.map((cat, i) => ({
    id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
    ...cat,
    postCount: 0,
    createdAt: randomDate(new Date(2023, 0, 1), new Date(2023, 6, 1)).toISOString(),
    updatedAt: new Date().toISOString()
  }));

  categoriesStore.write(categoryData);
  console.log(`✓ Created ${categoryData.length} categories`);
  return categoryData;
}

function generatePosts(users, categories, count = 50) {
  console.log(`Generating ${count} posts...`);
  const posts = [];
  const statuses = ['published', 'draft', 'published', 'published']; // More published than drafts
  const tags = ['tutorial', 'guide', 'tips', 'review', 'howto', 'beginner', 'advanced', 'news'];

  for (let i = 0; i < count; i++) {
    const category = randomElement(categories);
    const author = randomElement(users);
    const createdAt = randomDate(new Date(2023, 6, 1), new Date());

    const post = {
      id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
      title: randomElement(postTitles),
      content: `This is a comprehensive guide about ${randomElement(postTitles).toLowerCase()}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Key Points

1. Understanding the fundamentals
2. Practical applications
3. Best practices and tips
4. Common pitfalls to avoid

## Conclusion

This approach has proven to be effective in many real-world scenarios. Keep practicing and you'll master it in no time!`,
      authorId: author.id,
      categoryId: category.id,
      tags: [randomElement(tags), randomElement(tags)],
      status: randomElement(statuses),
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      createdAt: createdAt.toISOString(),
      updatedAt: randomDate(createdAt, new Date()).toISOString()
    };

    posts.push(post);
  }

  postsStore.write(posts);
  console.log(`✓ Created ${count} posts`);
  return posts;
}

function generateComments(users, posts, count = 100) {
  console.log(`Generating ${count} comments...`);
  const comments = [];

  for (let i = 0; i < count; i++) {
    const post = randomElement(posts);
    const author = randomElement(users);
    const createdAt = randomDate(new Date(post.createdAt), new Date());

    const comment = {
      id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
      postId: post.id,
      authorId: author.id,
      content: randomElement(commentTexts),
      parentId: null,
      likeCount: Math.floor(Math.random() * 20),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString()
    };

    comments.push(comment);
  }

  // Generate some reply comments
  const replyCount = Math.floor(count * 0.3);
  for (let i = 0; i < replyCount; i++) {
    const parentComment = randomElement(comments);
    const author = randomElement(users);
    const createdAt = randomDate(new Date(parentComment.createdAt), new Date());

    const reply = {
      id: Date.now().toString() + (count + i) + Math.random().toString(36).substr(2, 9),
      postId: parentComment.postId,
      authorId: author.id,
      content: randomElement(commentTexts),
      parentId: parentComment.id,
      likeCount: Math.floor(Math.random() * 10),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString()
    };

    comments.push(reply);
  }

  commentsStore.write(comments);
  console.log(`✓ Created ${comments.length} comments (including ${replyCount} replies)`);
  return comments;
}

function generateTodos(count = 30) {
  console.log(`Generating ${count} todos...`);
  const todos = [];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const tags = ['work', 'personal', 'urgent', 'feature', 'bug', 'enhancement', 'documentation'];

  for (let i = 0; i < count; i++) {
    const createdAt = randomDate(new Date(2024, 0, 1), new Date());
    const completed = Math.random() > 0.6; // 40% completed

    const todo = {
      id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
      title: randomElement(todoTitles),
      description: `Detailed description for: ${randomElement(todoTitles).toLowerCase()}. This task requires attention and should be completed according to project guidelines.`,
      completed,
      priority: randomElement(priorities),
      dueDate: randomDate(new Date(), new Date(2024, 12, 31)).toISOString().split('T')[0],
      tags: [randomElement(tags), randomElement(tags)],
      createdAt: createdAt.toISOString(),
      updatedAt: randomDate(createdAt, new Date()).toISOString()
    };

    todos.push(todo);
  }

  todosStore.write(todos);
  console.log(`✓ Created ${count} todos`);
  return todos;
}

function seedAll() {
  console.log('\n🌱 Starting database seeding...\n');

  const users = generateUsers(20);
  const categories = generateCategories();
  const posts = generatePosts(users, categories, 50);
  const comments = generateComments(users, posts, 100);
  const todos = generateTodos(30);

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('Summary:');
  console.log(`  - Users: ${users.length}`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Posts: ${posts.length}`);
  console.log(`  - Comments: ${comments.length}`);
  console.log(`  - Todos: ${todos.length}`);
  console.log('\n');
}

// Run seeding if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll, generateUsers, generateCategories, generatePosts, generateComments, generateTodos };
