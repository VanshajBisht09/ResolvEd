const mongoose = require('mongoose');

const meetingRequestSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  facultyId: { type: String, required: true },
  facultyName: { type: String, required: true },
  facultyType: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  preferredDate: { type: String },
  preferredTime: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Scheduled', 'Rescheduled', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  scheduledDate: { type: String },
  scheduledTime: { type: String },
  roomNumber: { type: String },
  buildingName: { type: String },
  meetingMode: { type: String },
  facultyNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);
