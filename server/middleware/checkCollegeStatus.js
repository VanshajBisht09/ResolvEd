const User = require('../models/User');
const College = require('../models/College');

const checkCollegeStatus = async (req, res, next) => {
    try {
        // Assume user is already authenticated and we have req.auth.userId
        // We need to fetch the user to get their collegeId, then check the college.
        // Or if the collegeId is in the token metadata, we can use that.
        // Let's fetch the user to be safe and get fresh status.
        
        const userId = req.auth.userId;
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'superadmin') {
            return next(); // Superadmin is never blocked
        }

        if (user.collegeId) {
            const college = await College.findById(user.collegeId);
            if (college && college.isBlocked) {
                return res.status(403).json({ message: 'Your college access has been suspended. Please contact your administrator.' });
            }
        }

        next();
    } catch (error) {
        console.error('Error checking college status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = checkCollegeStatus;
