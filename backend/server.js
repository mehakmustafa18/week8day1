require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();

// ---- Middleware ----
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));

// ---- MongoDB connection (works for both local & Vercel) ----
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    isConnected = false;
    console.error('❌ MongoDB error:', err.message);
    throw err;
  }
}

// ---- DB middleware — runs BEFORE every request ----
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed. Please try again.' });
  }
});

// ---- Serve frontend static files (local dev only) ----
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '..')));
}

// ---- API Routes ----
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/ai',      require('./routes/ai'));

// ---- Catch-all: index.html (local dev only) ----
if (process.env.NODE_ENV !== 'production') {
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
}

// ---- Start server locally ----
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  }).catch(() => process.exit(1));
}

module.exports = app;
