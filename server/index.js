require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db');
const { requireAuth, requireRole } = require('./middleware/auth');
const socketHandler = require('./socket');
const College = require('./models/College');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev to avoid port issues
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-mock-role']
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to DB
connectDB().then(async () => {
  // Seed Mock Data if in Dev/Mock Mode
  if (process.env.MOCK_AUTH === 'true') {
    try {
      const mockUserId = 'user_mock_123';
      const userExists = await User.findOne({ clerkId: mockUserId });
      
      if (!userExists) {
        console.log('Seeding Mock Admin User...');
        // Create Mock College
        let demoCollege = await College.findOne({ email: 'demo@college.edu' });
        if (!demoCollege) {
          demoCollege = await College.create({
            name: 'Demo University',
            email: 'demo@college.edu',
            address: '123 Mock Lane',
            subscriptionStatus: 'active'
          });
        }

        // Create Mock Admin
        await User.create({
          clerkId: mockUserId,
          firstName: 'Mock',
          lastName: 'Admin',
          email: 'admin@demo.edu',
          role: 'admin',
          collegeId: demoCollege._id
        });
        console.log('Mock Data Seeded: Admin User created linked to Demo University');
      }
    } catch (err) {
      console.error('Seeding Error:', err);
    }
  }
});

// Socket.io Setup
socketHandler(io);

// API Routes

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
const analysisRoutes = require('./routes/analysis');
const complaintRoutes = require('./routes/complaints');
const announcementRoutes = require('./routes/announcements');
const userRoutes = require('./routes/users');
const requestRoutes = require('./routes/requests')(io); // Pass io to requests
const superAdminRoutes = require('./routes/superAdmin');
const collegeAdminRoutes = require('./routes/collegeAdmin');

// Mount Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes); // Covers /sync and /faculty
app.use('/api/requests', requestRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/college', collegeAdminRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

