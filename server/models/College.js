const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  contactNumber: { type: String },
  isBlocked: { type: Boolean, default: false },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'trial'], default: 'trial' },
  subscriptionexpiry: { type: Date },
  logoUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  emailTemplates: {
    welcomeMember: {
        enabled: { type: Boolean, default: false },
        subject: { type: String, default: '' },
        body: { type: String, default: '' }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('College', collegeSchema);
