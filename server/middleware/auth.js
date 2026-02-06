const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Mock Middleware for development without keys
const mockAuth = (req, res, next) => {
  // Check for role in headers (set by frontend MockAuth)
  const mockRole = req.headers['x-mock-role'] || 'student';
  
  // Inject a dummy user
  req.auth = {
    userId: 'user_mock_123',
    claims: {
      metadata: {
        role: mockRole
      }
    }
  };
  next();
};

// Middleware to require authentication
const requireAuth = process.env.MOCK_AUTH === 'true' 
  ? mockAuth 
  : ClerkExpressRequireAuth({});

// Middleware to check roles (Student, Teacher, Admin)
const requireRole = (role) => {
  return (req, res, next) => {
    // In mock mode, we assume the user has the necessary role for simplicity or check the mocked claims
    if(process.env.MOCK_AUTH === 'true') {
        // For testing, we can just allow or check the mock metadata
         if (req.auth.claims.metadata.role !== role) {
             // For now, let's just log and allow in dev to prevent blocking, or strictly check
             console.log(`[MockAuth] Role check: Required ${role}, Has ${req.auth.claims.metadata.role}`);
             // return res.status(403).json({ message: 'Access denied' }); 
        }
        return next();
    }

    if (!req.auth || !req.auth.claims || !req.auth.claims.metadata || req.auth.claims.metadata.role !== role) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
