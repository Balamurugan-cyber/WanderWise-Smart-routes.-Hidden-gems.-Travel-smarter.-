// src/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));





console.log('→ typeof authRoutes:', typeof authRoutes);
console.log('→ authRoutes =', authRoutes);
console.log('→ resolved path =', require.resolve('./routes/authRoutes'));
if (typeof authRoutes !== 'function') {
  throw new Error('authRoutes is NOT a router function. Check its export!');
}








// Auth routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log('🔧 Booting server…');
    console.log('• PORT:', process.env.PORT);
    console.log('• Has MONGO_URI:', !!process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected');

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Startup error (full):', err);
    process.exit(1);
  }
})();
