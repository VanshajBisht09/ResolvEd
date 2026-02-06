const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // Clerk ID
  collegeId: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Cleanliness', 'Academic', 'Facilities'
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  adminComments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
