import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import onboardRoutes from './routes/onboard.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from './routes/categories.js';
import linkRoutes from './routes/links.js';
import publicRoutes from './routes/public.js';
import notificationRoutes from './routes/notifications.js';
import requestRoutes from './routes/requests.js';
import profileRoutes from './routes/profile.js';
import messageRoutes from './routes/messages.js';
import GlobalCategory from './models/GlobalCategory.js';

const SEED_CATEGORIES = [
  { name: 'Design Inspiration', description: 'UI/UX design references, portfolios, and creative inspiration.', icon: 'Palette', color: '#6c5dd3', isActive: true },
  { name: 'Dev Tools', description: 'Developer tools, libraries, frameworks, and resources.', icon: 'Code2', color: '#3eac68', isActive: true },
  { name: 'Marketing', description: 'Marketing strategies, campaigns, and analytics resources.', icon: 'TrendingUp', color: '#ff9b26', isActive: true },
  { name: 'Project Ideas', description: 'Side project concepts, experiments, and startup ideas.', icon: 'Lightbulb', color: '#ff6a55', isActive: true },
  { name: 'Read Later', description: 'Articles, blog posts, and content saved for later reading.', icon: 'BookOpen', color: '#6c5dd3', isActive: true },
  { name: 'Recipes', description: 'Cooking recipes, food blogs, and culinary inspiration.', icon: 'Coffee', color: '#3eac68', isActive: true },
  { name: 'Finance', description: 'Personal finance, investing, and money management resources.', icon: 'DollarSign', color: '#ff9b26', isActive: true },
  { name: 'Travel Plans', description: 'Travel destinations, itineraries, and trip planning links.', icon: 'Map', color: '#ff6a55', isActive: true },
];

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linker';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS — allow the Vite frontend and browser extensions
app.use((_req, res, next) => {
  const origin = _req.headers.origin;
  const isExtension =
    typeof origin === 'string' &&
    (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://'));

  if (isExtension) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (_req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'Linker API is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Onboard routes
app.use('/api/onboard', onboardRoutes);

// Category routes (user categories + global categories picker)
app.use('/api/categories', categoryRoutes);

// Link routes
app.use('/api/links', linkRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Public routes (no auth)
app.use('/api/public', publicRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Request routes
app.use('/api/requests', requestRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Message routes
app.use('/api/messages', messageRoutes);

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    const { host, name, db } = mongoose.connection;
    console.log(`✅ DB connected — host: ${host} | db: ${name}`);

    // Sync Mongoose model indexes with Atlas
    await mongoose.connection.syncIndexes();
    const collections = await db.listCollections().toArray();
    console.log(`📦 Collections synced: ${collections.map((c) => c.name).join(', ') || 'none yet'}`);

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Auto-seed global categories if none exist
    const count = await GlobalCategory.countDocuments();
    if (count === 0) {
      await GlobalCategory.insertMany(SEED_CATEGORIES);
      console.log(`🌱 Seeded ${SEED_CATEGORIES.length} global categories`);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
