const express = require('express');
const router = express.Router();
const MeetingRequest = require('../models/MeetingRequest');
const { requireAuth } = require('../middleware/auth');

module.exports = (io) => {
    // Get all requests for a user
    router.get('/', requireAuth, async (req, res) => {
        try {
            const userId = req.auth.userId; 
            // Clerk ID is string used in models
            const requests = await MeetingRequest.find({
                $or: [{ studentId: userId }, { facultyId: userId }]
            }).sort({ createdAt: -1 });
            res.json(requests);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching requests' });
        }
    });

    // Create a new request
    router.post('/', requireAuth, async (req, res) => {
        try {
            const newRequest = new MeetingRequest(req.body);
            await newRequest.save();

            // Emit real-time event
            io.to(newRequest.facultyId).emit('request_created', newRequest);
            io.to(newRequest.studentId).emit('request_created', newRequest);
            
            res.status(201).json(newRequest);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating request' });
        }
    });

    // Update request status
    router.put('/:id', requireAuth, async (req, res) => {
        try {
            const { status, ...updates } = req.body;
            const request = await MeetingRequest.findByIdAndUpdate(
                req.params.id, 
                { status, ...updates },
                { new: true }
            );
            
            if (!request) return res.status(404).json({ message: 'Request not found' });

            io.to(request.studentId).emit('request_updated', request);
            io.to(request.facultyId).emit('request_updated', request);

            res.json(request);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating request' });
        }
    });

    return router;
};
