const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const resumeSchema = new mongoose.Schema({
  resumeId:  { type: String, required: true },
  template:  { type: String, default: 'sidebar' },
  color:     { type: String, default: '#1a365d' },
  data:      { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  resumes:   { type: [resumeSchema], default: [] },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
