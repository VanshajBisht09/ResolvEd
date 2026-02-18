const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// User Sync
router.post('/sync', requireAuth, async(req, res) => {
    try {
        const { email, firstName, lastName, role, collegeId } = req.body;
        const clerkId = req.auth.userId;
        
        // Find or create
        let user = await User.findOne({ clerkId });
        if(user) {
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            await user.save();
        } else {
            user = await User.create({
                clerkId, email, firstName, lastName, role, collegeId
            });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sync failed" });
    }
});

// Get all faculty members
router.get('/faculty', requireAuth, async (req, res) => {
    try {
        const faculty = await User.find({ role: { $in: ['teacher', 'faculty'] } }).select('-password');
        res.json(faculty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching faculty' });
    }
});

module.exports = router;
