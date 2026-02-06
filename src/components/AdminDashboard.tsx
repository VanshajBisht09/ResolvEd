import { useState } from 'react';
import { MeetingRequest, User } from '../types';
import { Button, Card, Box, Typography, Grid, IconButton, Drawer, Divider, useTheme, alpha } from '@mui/material';
import { Menu, LogOut, Users, Calendar, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  user: User;
  allRequests: MeetingRequest[];
  onLogout: () => void;
}

export function AdminDashboard({ user, allRequests, onLogout }: AdminDashboardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();

  const totalRequests = allRequests.length;
  const pendingRequests = allRequests.filter((r) => r.status === 'Pending').length;
  const scheduledRequests = allRequests.filter((r) => r.status === 'Scheduled').length;
  const completedRequests = allRequests.filter((r) => r.status === 'Completed').length;

  // Mock faculty stats
  const facultyStats = [
    { name: 'Dr. Sarah Johnson', requests: 5, scheduled: 2, completed: 1 },
    { name: 'Prof. Michael Chen', requests: 2, scheduled: 1, completed: 0 },
    { name: 'Dr. Emily Williams', requests: 1, scheduled: 0, completed: 0 },
  ];

  // Request trend data
  const trendData = [
    { day: 'Mon', requests: 12 },
    { day: 'Tue', requests: 15 },
    { day: 'Wed', requests: 8 },
    { day: 'Thu', requests: 18 },
    { day: 'Fri', requests: 14 },
  ];

  // Issue type breakdown
  const issueTypes = allRequests.reduce((acc, req) => {
    acc[req.issueType] = (acc[req.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="primary" fontWeight="700">ResolvEd</Typography>
            <Typography variant="caption" color="text.secondary">Admin Dashboard</Typography>
          </Box>
          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <Menu size={24} />
          </IconButton>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
           <Typography variant="h6" gutterBottom>Menu</Typography>
           <Divider sx={{ mb: 2 }} />
           <Box sx={{ mb: 3 }}>
             <Typography variant="body2" color="text.secondary">Profile</Typography>
             <Typography variant="body1">{user.name}</Typography>
             <Typography variant="caption" color="text.secondary">{user.email}</Typography>
             <Typography variant="caption" display="block" color="primary" fontWeight="500">Administrator</Typography>
           </Box>
           <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                    variant="text" 
                    color="error" 
                    size="small"
                    startIcon={<LogOut size={18} />}
                    onClick={onLogout}
                    sx={{ 
                        minWidth: 'auto',
                        fontWeight: 600,
                        opacity: 0.8,
                        '&:hover': { opacity: 1, bgcolor: 'error.lighter' } 
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
      </Drawer>

      <Box sx={{ p: 3 }}>
        {/* Overview Stats */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>Overview</Typography>
          <Grid container spacing={2}>
             <Grid size={{ xs: 6, md: 3 }}>
                <Card sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            width: 40, height: 40, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(79, 70, 229, 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                             <Calendar size={20} color="#4f46e5" />
                        </Box>

                        <Box>
                            <Typography variant="body2" color="text.secondary">Total Requests</Typography>
                            <Typography variant="h5" fontWeight="700">{totalRequests}</Typography>
                        </Box>
                    </Box>
                </Card>
             </Grid>

             <Grid size={{ xs: 6, md: 3 }}>
                <Card sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            width: 40, height: 40, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.primary.main, 0.1), 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                             <Calendar size={20} color={theme.palette.primary.main} />
                        </Box>

                        <Box>
                            <Typography variant="body2" color="text.secondary">Total Requests</Typography>
                            <Typography variant="h5" fontWeight="700">{totalRequests}</Typography>
                        </Box>
                    </Box>
                </Card>
             </Grid>

             <Grid size={{ xs: 6, md: 3 }}>
                <Card sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            width: 40, height: 40, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.warning.main, 0.1), 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                             <Clock size={20} color={theme.palette.warning.main} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Pending</Typography>
                            <Typography variant="h5" fontWeight="700">{pendingRequests}</Typography>
                        </Box>
                    </Box>
                </Card>
             </Grid>

             <Grid size={{ xs: 6, md: 3 }}>
                <Card sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         <Box sx={{ 
                            width: 40, height: 40, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.info.main, 0.1), 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                             <CheckSquare size={20} color={theme.palette.info.main} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Scheduled</Typography>
                            <Typography variant="h5" fontWeight="700">{scheduledRequests}</Typography>
                        </Box>
                    </Box>
                </Card>
             </Grid>

             <Grid size={{ xs: 6, md: 3 }}>
                <Card sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            width: 40, height: 40, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.success.main, 0.1), 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                             <TrendingUp size={20} color={theme.palette.success.main} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Completed</Typography>
                            <Typography variant="h5" fontWeight="700">{completedRequests}</Typography>
                        </Box>
                    </Box>
                </Card>
             </Grid>
          </Grid>
        </Box>

        {/* Request Trends */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>Weekly Request Trend</Typography>
          <Box sx={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Faculty Performance */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
             <Typography variant="h6" fontWeight="600">Faculty Activity</Typography>
             <Users size={20} color="gray" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {facultyStats.map((faculty, index) => (
              <Box
                key={index}
                sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: 1, borderColor: 'divider' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" fontWeight="500">{faculty.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{faculty.requests} total</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                   <Typography variant="body2" color="primary.main">{faculty.scheduled} scheduled</Typography>
                   <Typography variant="body2" color="success.main">{faculty.completed} completed</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Issue Type Breakdown */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>Issue Categories</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(issueTypes).map(([type, count]) => (
              <Box key={type}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{type}</Typography>
                  <Typography variant="body2" fontWeight="500">{count}</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                   <Box sx={{ width: `${(count / totalRequests) * 100}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
        
        {/* Quick Actions */}
        <Grid container spacing={2}>
           <Grid size={{ xs: 6 }}>
              <Button variant="outlined" fullWidth startIcon={<Users size={16} />}>
                Manage Faculty
              </Button>
           </Grid>
           <Grid size={{ xs: 6 }}>
              <Button variant="outlined" fullWidth startIcon={<Calendar size={16} />}>
                View Calendar
              </Button>
           </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
