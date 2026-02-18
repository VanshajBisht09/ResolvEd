const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().sort({ createdAt: -1 });
        
        console.log('--- Current Users in DB ---');
        users.forEach(u => {
            console.log(`ID: ${u._id} | Email: ${u.email} | Name: ${u.firstName} ${u.lastName} | College: ${u.collegeId}`);
        });
        console.log('---------------------------');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsers();
