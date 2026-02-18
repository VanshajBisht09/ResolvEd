const mongoose = require('mongoose');
const User = require('./models/User');
const College = require('./models/College');
require('dotenv').config();

const fixData = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Get Mock Admin
        const admin = await User.findOne({ clerkId: 'user_mock_123' });
        if (!admin) { console.log('No Mock Admin found'); process.exit(); }
        console.log(`Mock Admin College: ${admin.collegeId}`);

        // 2. Count Users by College
        const users = await User.find();
        const counts = {};
        
        users.forEach(u => {
            if (!u.collegeId) {
                // orphan
            } else {
                const id = u.collegeId.toString();
                counts[id] = (counts[id] || 0) + 1;
            }
        });
        console.log('User Distribution:', counts);

        // 3. Fix: Move all users to Admin's College
        if (admin.collegeId) {
            console.log(`Migrating all users to College ${admin.collegeId}...`);
            const result = await User.updateMany(
                { 
                    $or: [
                        { collegeId: { $ne: admin.collegeId } },
                        { collegeId: null }
                    ],
                    role: { $ne: 'superadmin' } 
                },
                { $set: { collegeId: admin.collegeId } }
            );
            console.log(`Migration Complete: Moved ${result.modifiedCount} users.`);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixData();
