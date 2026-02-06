require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./db');

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing users? Maybe not, to avoid data loss.
        // Let's upsert based on Clerk ID.

        const faculty = [
            {
                clerkId: 'fac1',
                firstName: 'Sarah',
                lastName: 'Smith',
                email: 'sarah.smith@univ.edu',
                role: 'teacher',
                metadata: { department: 'Computer Science' }
            },
            {
                clerkId: 'fac2',
                firstName: 'James',
                lastName: 'Wilson',
                email: 'james.wilson@univ.edu',
                role: 'teacher',
                metadata: { department: 'Mathematics' }
            }
        ];

        const students = [
            {
                clerkId: 'std1',
                firstName: 'Alex',
                lastName: 'Johnson',
                email: 'alex.j@student.univ.edu',
                role: 'student',
                metadata: { year: '3rd' }
            }
        ];

        for (const f of faculty) {
            await User.findOneAndUpdate({ clerkId: f.clerkId }, f, { upsert: true, new: true });
            console.log(`Seeded faculty: ${f.firstName} ${f.lastName}`);
        }

        for (const s of students) {
            await User.findOneAndUpdate({ clerkId: s.clerkId }, s, { upsert: true, new: true });
            console.log(`Seeded student: ${s.firstName} ${s.lastName}`);
        }

        console.log('Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
