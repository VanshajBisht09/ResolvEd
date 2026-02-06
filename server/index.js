require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db');
const { requireAuth, requireRole } = require('./middleware/auth');
const socketHandler = require('./socket');

// Routes (Imports)
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Announcement = require('./models/Announcement');
const College = require('./models/College');

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

// AI Analysis Endpoint (Mock)
app.get('/api/analysis/:studentId', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    // Mock logic: Fetch student data (attendance, grades - assuming we had them)
    // For now, return a generated analysis
    const analysis = {
      studentId,
      performance: "Good",
      attendance: "85%",
      riskLevel: "Low",
      suggestions: [
        "Encourage participation in extra-curriculars.",
        "Maintain current study habits."
      ],
      generatedAt: new Date()
    };
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Complaints Routes
app.post('/api/complaints', requireAuth, async (req, res) => {
  try {
    const { type, description, collegeId } = req.body;
    const newComplaint = new Complaint({
      studentId: req.auth.userId,
      collegeId,
      type,
      description
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint' });
  }
});

app.get('/api/complaints/:collegeId', requireAuth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ collegeId: req.params.collegeId });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints' });
    }
});

// Announcement Routes
app.post('/api/announcements', requireAuth, async (req, res) => {
    try {
        const { title, content, collegeId } = req.body;
        const newAnnouncement = new Announcement({
            title,
            content,
            authorId: req.auth.userId,
            collegeId
        });
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating announcement' });
    }
});

app.get('/api/announcements/:collegeId', requireAuth, async (req, res) => {
    try {
        const announcements = await Announcement.find({ collegeId: req.params.collegeId }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

// User Sync (Webhooks or client-side post-signup calls)
app.post('/api/users/sync', requireAuth, async(req, res) => {
    try {
        const { email, firstName, lastName, role, collegeId } = req.body;
        const clerkId = req.auth.userId;
        
        // Find or create
        let user = await User.findOne({ clerkId });
        if(user) {
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            await user.save();
        } else {
            user = await User.create({
                clerkId, email, firstName, lastName, role, collegeId
            });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sync failed" });
    }
});



// Super Admin & College Admin Routes
const superAdminRoutes = require('./routes/superAdmin');
const collegeAdminRoutes = require('./routes/collegeAdmin');

app.use('/api/superadmin', superAdminRoutes);
app.use('/api/college', collegeAdminRoutes);

// Meeting Request Routes
const MeetingRequest = require('./models/MeetingRequest');

// Get all requests for a user
app.get('/api/requests', requireAuth, async (req, res) => {
    try {
        const userId = req.auth.userId; 
        // Clerk ID is string used in models
        const requests = await MeetingRequest.find({
            $or: [{ studentId: userId }, { facultyId: userId }]
        }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

// Create a new request
app.post('/api/requests', requireAuth, async (req, res) => {
    try {
        const newRequest = new MeetingRequest(req.body);
        await newRequest.save();

        // Emit real-time event
        io.to(newRequest.facultyId).emit('request_created', newRequest);
        io.to(newRequest.studentId).emit('request_created', newRequest);
        
        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating request' });
    }
});

// Update request status
app.put('/api/requests/:id', requireAuth, async (req, res) => {
    try {
        const { status, ...updates } = req.body;
        const request = await MeetingRequest.findByIdAndUpdate(
            req.params.id, 
            { status, ...updates },
            { new: true }
        );
        
        if (!request) return res.status(404).json({ message: 'Request not found' });

        io.to(request.studentId).emit('request_updated', request);
        io.to(request.facultyId).emit('request_updated', request);

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating request' });
    }
});

// Get all faculty members
app.get('/api/users/faculty', requireAuth, async (req, res) => {
    try {
        const faculty = await User.find({ role: { $in: ['teacher', 'faculty'] } }).select('-password');
        res.json(faculty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching faculty' });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
