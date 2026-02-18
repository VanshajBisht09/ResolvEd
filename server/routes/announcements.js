const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content, collegeId } = req.body;
        const newAnnouncement = new Announcement({
            title,
            content,
            authorId: req.auth.userId,
            collegeId
        });
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating announcement' });
    }
});

router.get('/:collegeId', requireAuth, async (req, res) => {
    try {
        const announcements = await Announcement.find({ collegeId: req.params.collegeId }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

module.exports = router;
