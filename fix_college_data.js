const mongoose = require('mongoose');
// Correct paths for root execution
const User = require('./server/models/User');
const College = require('./server/models/College');
const path = require('path');
const dotenv = require('dotenv');

// Load env explicitly
const envPath = path.resolve(__dirname, 'server', '.env');
dotenv.config({ path: envPath });

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
        let orphanCount = 0;

        users.forEach(u => {
            if (!u.collegeId) {
                orphanCount++;
            } else {
                const id = u.collegeId.toString();
                counts[id] = (counts[id] || 0) + 1;
            }
        });

        console.log('User Distribution:', counts);
        console.log('Orphan Users:', orphanCount);

        // 3. Fix: Move all users to Admin's College
        if (admin.collegeId) {
            console.log(`Migrating all users to College ${admin.collegeId}...`);
            // Update non-superadmin users who have a different collegeId or no collegeId
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
            console.log(`Fixed/Migrated ${result.modifiedCount} users to the current Admin context.`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixData();
