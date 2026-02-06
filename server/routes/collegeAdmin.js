const express = require('express');
const router = express.Router();
const User = require('../models/User');
const College = require('../models/College');
const { requireAuth, requireRole } = require('../middleware/auth');
const checkCollegeStatus = require('../middleware/checkCollegeStatus');
const { sendEmail } = require('../services/emailService');
const welcomeMemberTemplate = require('../templates/welcomeMember');
const crypto = require('crypto');
const multer = require('multer');
const xlsx = require('xlsx');

// Configuration for Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generatePassword = () => crypto.randomBytes(4).toString('hex');

// Add Single Member
router.post('/members', requireAuth, requireRole('admin'), checkCollegeStatus, async (req, res) => {
    try {
        const { firstName, lastName, email, role } = req.body;
        const currentUser = await User.findOne({ clerkId: req.auth.userId }).populate('collegeId');
        
        if (!currentUser || !currentUser.collegeId) {
            return res.status(400).json({ message: 'College context missing for admin' });
        }

        const college = currentUser.collegeId;

        // Check if user exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const password = generatePassword();
        const clerkId = `user_${Date.now()}`; // Placeholder mock ID

        const newUser = new User({
            clerkId,
            email,
            firstName,
            lastName,
            role,
            collegeId: college._id
        });
        await newUser.save();

        await newUser.save();

        let emailSubject = `Welcome to ${college.name} - ResolvEd`;
        let emailHtml = welcomeMemberTemplate(`${firstName} ${lastName}`, college.name, email, password, role, college.logoUrl);

        // Check for custom template
        if (college.emailTemplates && college.emailTemplates.welcomeMember && college.emailTemplates.welcomeMember.enabled) {
            const custom = college.emailTemplates.welcomeMember;
            emailSubject = custom.subject
                .replace(/{{name}}/g, `${firstName} ${lastName}`)
                .replace(/{{collegeName}}/g, college.name);
            
            emailHtml = custom.body
                .replace(/{{name}}/g, `${firstName} ${lastName}`)
                .replace(/{{email}}/g, email)
                .replace(/{{password}}/g, password)
                .replace(/{{role}}/g, role)
                .replace(/{{collegeName}}/g, college.name)
                .replace(/{{loginLink}}/g, process.env.CLIENT_URL || 'http://localhost:3000');
        }

        await sendEmail(email, emailSubject, emailHtml);

        res.status(201).json({ message: 'Member added successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding member' });
    }
});

// Bulk Import Members (Excel)
router.post('/members/bulk', requireAuth, requireRole('admin'), checkCollegeStatus, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const currentUser = await User.findOne({ clerkId: req.auth.userId }).populate('collegeId');
        if (!currentUser || !currentUser.collegeId) {
            return res.status(400).json({ message: 'College context missing for admin' });
        }
        const college = currentUser.collegeId;

        const isCsv = req.file.originalname.endsWith('.csv');
        const workbook = isCsv 
            ? xlsx.read(req.file.buffer.toString(), { type: 'string' })
            : xlsx.read(req.file.buffer, { type: 'buffer' });
        
        const sheetName = workbook.SheetNames[0];
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        console.log(`Processing ${rows.length} rows from sheet: ${sheetName}`);
        if(rows.length > 0) console.log('Sample Row Headers:', Object.keys(rows[0]));

        const results = {
            added: 0,
            failed: 0,
            errors: []
        };

        for (const row of rows) {
            // Expecting columns: FirstName, LastName, Email, Role
            // Normalized keys if needed, but for now strict
            const { FirstName, LastName, Role } = row;
            let { Email } = row;
            
            if (!Email) {
                 results.failed++;
                 results.errors.push(`Skipped Row: Missing Email - ${JSON.stringify(row)}`);
                 continue;
            }

            Email = Email.trim(); // Sanitize

            // Check existence
            const existingUser = await User.findOne({ email: Email });
            if (existingUser) {
                results.failed++;
                results.errors.push(`Skipped ${Email}: User already exists (ID: ${existingUser._id})`);
                continue;
            }

            try {
                const password = generatePassword();
                const clerkId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                const newUser = new User({
                    clerkId,
                    email: Email,
                    firstName: FirstName,
                    lastName: LastName || '',
                    role: Role?.toLowerCase() || 'student', // Default to student
                    collegeId: college._id
                });
                await newUser.save();

                const fullName = LastName ? `${FirstName} ${LastName}` : FirstName;
                let emailSubject = `Welcome to ${college.name} - ResolvEd`;
                let emailHtml = welcomeMemberTemplate(fullName, college.name, Email, password, Role || 'student', college.logoUrl);

                 // Check for custom template
                if (college.emailTemplates && college.emailTemplates.welcomeMember && college.emailTemplates.welcomeMember.enabled) {
                    const custom = college.emailTemplates.welcomeMember;
                    emailSubject = custom.subject
                        .replace(/{{name}}/g, fullName)
                        .replace(/{{collegeName}}/g, college.name);
                    
                    emailHtml = custom.body
                        .replace(/{{name}}/g, fullName)
                        .replace(/{{email}}/g, Email)
                        .replace(/{{password}}/g, password)
                        .replace(/{{role}}/g, Role || 'student')
                        .replace(/{{collegeName}}/g, college.name)
                        .replace(/{{loginLink}}/g, process.env.CLIENT_URL || 'http://localhost:3000');
                }

                // Don't await email to speed up loop, or promise.all later. For now, await is safer but slower.
                await sendEmail(Email, emailSubject, emailHtml);

                results.added++;
            } catch (err) {
                console.error(`Import error for ${Email}:`, err);
                results.failed++;
                // Check if user was actually saved but email failed
                const savedUser = await User.findOne({ email: Email });
                if (savedUser) {
                    results.errors.push(`User ${Email} added, but email failed: ${err.message}`);
                    results.added++; // Count as added? Or partial?
                    results.failed--; 
                } else {
                    results.errors.push(`Error adding ${Email}: ${err.message}`);
                }
            }
        }

        res.json({ message: 'Bulk import processing complete', results });

    } catch (error) {
        console.error('Bulk Import Error:', error);
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
});

// List Members
router.get('/members', requireAuth, requireRole('admin'), checkCollegeStatus, async (req, res) => {
    try {
        const currentUser = await User.findOne({ clerkId: req.auth.userId });
        // collegeId is already checked by middleware
        
        const users = await User.find({ collegeId: currentUser.collegeId }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching members' });
    }
});

// Delete Member
router.delete('/members/:id', requireAuth, requireRole('admin'), checkCollegeStatus, async (req, res) => {
    console.log(`DELETE request for member: ${req.params.id}`);
    try {
        const currentUser = await User.findOne({ clerkId: req.auth.userId });
        const memberToDelete = await User.findById(req.params.id);

        if (!memberToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure admin can only delete members of their own college
        if (memberToDelete.collegeId.toString() !== currentUser.collegeId.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this member' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error("DELETE Member Error:", error);
        res.status(500).json({ message: 'Error deleting member' });
    }
});

// Update Email Templates
router.put('/settings/email-templates', requireAuth, requireRole('admin'), checkCollegeStatus, async (req, res) => {
    try {
        const { type, subject, body, enabled } = req.body; // type e.g., 'welcomeMember'
        
        if (!type || !subject || !body) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const currentUser = await User.findOne({ clerkId: req.auth.userId });
        const college = await College.findById(currentUser.collegeId);

        if (!college.emailTemplates) college.emailTemplates = {};
        college.emailTemplates[type] = { 
            subject, 
            body,
            enabled: enabled === undefined ? false : enabled
        };
        
        await college.save();
        res.json({ message: 'Email template updated successfully', templates: college.emailTemplates });
    } catch (error) {
        console.error('Error updating email template:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
});

// Get Email Templates
router.get('/settings/email-templates', requireAuth, requireRole('admin'), checkCollegeStatus, async (req, res) => {
    try {
        const currentUser = await User.findOne({ clerkId: req.auth.userId });
        const college = await College.findById(currentUser.collegeId);
        res.json(college.emailTemplates || {});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

module.exports = router;
