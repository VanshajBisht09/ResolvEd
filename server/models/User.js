const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  metadata: { type: Object }, // Store extra info like department, year, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
