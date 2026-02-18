const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(__dirname, 'server', '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const checkDB = async () => {
    try {
        console.log('MONGO_URI:', process.env.MONGO_URI);
        if(!process.env.MONGO_URI) {
            console.error('MONGO_URI is undefined!');
            process.exit(1);
        }

        const User = require('./server/models/User');
        const College = require('./server/models/College');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const mockUser = await User.findOne({ clerkId: 'user_mock_123' });
        console.log('Mock User (user_mock_123):', mockUser ? 'Found' : 'Not Found');
        
        if (mockUser) {
             console.log('Mock User College ID:', mockUser.collegeId);
             if (mockUser.collegeId) {
                 const linkedCollege = await College.findById(mockUser.collegeId);
                 console.log('Linked College Name:', linkedCollege ? linkedCollege.name : 'Unknown (Invalid ID)');
             }
        }

        const colleges = await College.find().limit(5);
        console.log(`Found ${colleges.length} Colleges`);
        colleges.forEach(c => console.log(`- ${c.name} (ID: ${c._id})`));

        if (!mockUser && colleges.length > 0) {
            console.log('Creating Mock User linked to first college...');
            const newUser = new User({
                clerkId: 'user_mock_123',
                email: 'mock_admin@test.com',
                firstName: 'Mock',
                lastName: 'Admin',
                role: 'admin',
                collegeId: colleges[0]._id
            });
            await newUser.save();
            console.log('Mock User Created!');
        } else if (mockUser && !mockUser.collegeId && colleges.length > 0) {
             console.log('Linking Mock User to first college...');
             mockUser.collegeId = colleges[0]._id;
             await mockUser.save();
             console.log('Mock User Linked!');
        }

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
