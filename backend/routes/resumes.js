const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

// GET /api/resumes — get all resumes for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('resumes');
    res.json(user.resumes || []);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/resumes — save or update a resume
router.post('/', auth, async (req, res) => {
  try {
    const { resumeId, template, color, data } = req.body;
    const now  = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const user = await User.findById(req.userId);

    const idx = user.resumes.findIndex(r => r.resumeId === resumeId);
    if (idx > -1) {
      user.resumes[idx] = { resumeId, template, color, data, updatedAt: now };
    } else {
      user.resumes.push({ resumeId, template, color, data, updatedAt: now });
    }
    user.markModified('resumes');
    await user.save();
    res.json({ message: 'Saved.', resumes: user.resumes });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/resumes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.resumes = user.resumes.filter(r => r.resumeId !== req.params.id);
    await user.save();
    res.json({ message: 'Deleted.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
