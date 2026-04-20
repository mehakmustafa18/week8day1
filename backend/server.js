require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();

// ---- Middleware ----
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));

// ---- Serve frontend static files ----
// Only serve locally — on Vercel, static files are handled by @vercel/static
if (process.env.NODE_ENV !== 'production') {
  const frontendPath = path.join(__dirname, '..');
  app.use(express.static(frontendPath));
}

// ---- API Routes ----
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/ai',      require('./routes/ai'));

// ---- Catch-all: serve index.html (local only) ----
if (process.env.NODE_ENV !== 'production') {
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
}

// ---- Connect MongoDB & Start (local only) ----
// Vercel handles the server lifecycle, so we only listen locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
} else {
  // On Vercel — connect mongoose lazily per request
  let isConnected = false;
  const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  };
  app.use(async (req, res, next) => {
    try { await connectDB(); next(); }
    catch (err) { res.status(500).json({ message: 'DB connection failed' }); }
  });
}

module.exports = app;
