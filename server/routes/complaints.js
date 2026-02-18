const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, async (req, res) => {
  try {
    const { type, description, collegeId } = req.body;
    const newComplaint = new Complaint({
      studentId: req.auth.userId,
      collegeId,
      type,
      description
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint' });
  }
});

router.get('/:collegeId', requireAuth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ collegeId: req.params.collegeId });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints' });
    }
});

module.exports = router;
