const mongoose = require('mongoose');
const User = require('./models/User');
const College = require('./models/College');
require('dotenv').config();

const checkDB = async () => {
    try {
        console.log('Connecting to Mongo:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Find or Create Mock User
        let mockUser = await User.findOne({ clerkId: 'user_mock_123' });
        console.log('Mock User (user_mock_123):', mockUser ? 'Found' : 'Not Found');

        // 2. Find Any College
        const colleges = await College.find().limit(1);
        if (colleges.length === 0) {
            console.log('NO COLLEGES FOUND! Please onboard a college first via Super Admin.');
            process.exit(0);
        }
        const firstCollege = colleges[0];
        console.log(`Linking to College: ${firstCollege.name} (${firstCollege._id})`);

        if (!mockUser) {
            console.log('Creating Mock User...');
            mockUser = new User({
                clerkId: 'user_mock_123',
                email: 'mock_admin@test.com',
                firstName: 'Mock',
                lastName: 'Admin',
                role: 'admin',
                collegeId: firstCollege._id
            });
            await mockUser.save();
            console.log('Mock User Created and Linked!');
        } else {
            console.log('Updating Mock User link...');
            mockUser.collegeId = firstCollege._id;
            mockUser.role = 'admin'; // Ensure role is admin
            await mockUser.save();
            console.log('Mock User Linked to College!');
        }
        
        console.log('SUCCESS: Admin Context Fixed.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
