const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // Clerk ID
  receiverId: { type: String }, // Clerk ID (for 1-on-1)
  groupId: { type: String }, // For group chat
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
