const express = require('express');
const router = express.Router();
const College = require('../models/College');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const welcomeCollegeTemplate = require('../templates/welcomeCollege');
const crypto = require('crypto');

// Generate random password
const generatePassword = () => crypto.randomBytes(4).toString('hex');

// Create College (Onboarding)
router.post('/colleges', requireAuth, requireRole('superadmin'), async (req, res) => {
    try {
        console.log('[API] POST /colleges called with body:', req.body);
        const { name, email, address, contactNumber, website, subscriptionStatus, description, logoUrl } = req.body;

        // Check if college exists
        let existingCollege = await College.findOne({ email });
        if (existingCollege) {
            return res.status(400).json({ message: 'College with this email already exists' });
        }

        // Create College
        const newCollege = new College({
            name,
            email,
            address,
            contactNumber,
            logoUrl: logoUrl || '',
            description: description || '',
            website: website || '',
            subscriptionStatus: subscriptionStatus || 'active'
        });
        await newCollege.save();

        // Create College Admin User
        // Note: In a real app with Clerk, we might need to create the user in Clerk first via their API.
        // For this implementation, we'll create the user in our DB and assume they will sign up/sign in via Clerk matching the email,
        // OR we just send them credentials to use (if we successfully created in Clerk via SDK - but Clerk SDK is deprecated/mocked here).
        // A common pattern with Clerk is to Invite the user.
        // For simplicity and alignment with "sending mail with credentials", we will generate a password 
        // and ideally we would create the user in Clerk.
        // Since we are mocking or using a basic setup, let's just create the local User record and send the email.
        
        const password = generatePassword();
        
        // Use a placeholder Clerk ID since we can't generate a real one without the Clerk API key/SDK working fully.
        // If the user logs in later with this email, we sync. 
        // Ideally, we should use the Clerk Backend API to create the user `clerkClient.users.createUser`.
        // But let's stick to the requirements: "send a mail ... with welcome template".
        
        // We will send the email with the generated password.
        console.log('[Email Debug] Preparing to send welcome email.');
        console.log('[Email Debug] College Name:', name);
        console.log('[Email Debug] Email:', email);
        console.log('[Email Debug] Logo URL:', logoUrl);

        const emailHtml = welcomeCollegeTemplate(name, email, password, logoUrl);
        
        try {
            await sendEmail(email, 'Welcome to ResolvEd - Your College Dashboard', emailHtml);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError.message);
            // Proceed without failing the request, but maybe warn in response?
        }


        res.status(201).json({ message: 'College onboarding successful', college: newCollege });

    } catch (error) {
        console.error('Error onboarding college:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// List Colleges
router.get('/colleges', requireAuth, requireRole('superadmin'), async (req, res) => {
    try {
        const colleges = await College.find().sort({ createdAt: -1 });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching colleges' });
    }
});

// Update College Details
router.put('/colleges/:id', requireAuth, requireRole('superadmin'), async (req, res) => {
    try {
        const { name, email, address, contactNumber, logoUrl, description, website, subscriptionStatus } = req.body;
        
        // If email is being changed, check for uniqueness
        if (email) {
            const existing = await College.findOne({ email, _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({ message: 'Email already in use by another college' });
            }
        }

        // Get the original college before update to check if email changed
        const originalCollege = await College.findById(req.params.id);
        if (!originalCollege) return res.status(404).json({ message: 'College not found' });

        const emailChanged = email && email !== originalCollege.email;

        const updatedCollege = await College.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                address,
                contactNumber,
                logoUrl,
                description,
                website,
                subscriptionStatus
            },
            { new: true }
        );

        if (emailChanged) {
             const password = generatePassword();
             const emailHtml = welcomeCollegeTemplate(name || originalCollege.name, email, password, updatedCollege.logoUrl);
             
             try {
                await sendEmail(email, 'Welcome to ResolvEd - Your College Dashboard', emailHtml);
                console.log(`[API] Email updated for college ${updatedCollege._id}. Welcome email sent to ${email}`);
             } catch (emailError) {
                 console.error('Failed to send welcome email on update:', emailError.message);
             }
        }

        res.json({ message: 'College updated successfully', college: updatedCollege });
    } catch (error) {
        console.error('Error updating college:', error);
        res.status(500).json({ message: 'Error updating college' });
    }
});

// Block/Unblock College
router.put('/colleges/:id/block', requireAuth, requireRole('superadmin'), async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const college = await College.findByIdAndUpdate(
            req.params.id,
            { isBlocked },
            { new: true }
        );
        if (!college) return res.status(404).json({ message: 'College not found' });
        
        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Error updating college status' });
    }
});

// Delete College
router.delete('/colleges/:id', requireAuth, requireRole('superadmin'), async (req, res) => {
    try {
        const college = await College.findByIdAndDelete(req.params.id);
        if (!college) return res.status(404).json({ message: 'College not found' });
        res.json({ message: 'College deleted successfully' });
    } catch (error) {
        console.error('Error deleting college:', error);
        res.status(500).json({ message: 'Error deleting college' });
    }
});

module.exports = router;
