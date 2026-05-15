import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import onboardRoutes from './routes/onboard.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linker';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS — allow the Vite frontend
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
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

// Admin routes
app.use('/api/admin', adminRoutes);

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
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
