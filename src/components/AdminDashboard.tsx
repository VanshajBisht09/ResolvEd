import { useState } from 'react';
import { MeetingRequest, User } from '../types';
import { Button, Card, Box, Typography, Grid, IconButton, Drawer, Divider, useTheme, alpha, CardContent, Chip } from '@mui/material';
import { Menu, LogOut, Users, Calendar, CheckSquare, Clock, TrendingUp, Activity, Bell, Search, GraduationCap, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdminDashboardProps {
  user: User;
  allRequests: MeetingRequest[];
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ user, allRequests, onLogout, onNavigate }: AdminDashboardProps) {
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
    { day: 'Sat', requests: 5 },
    { day: 'Sun', requests: 2 },
  ];

  // Issue type breakdown
  const issueTypes = allRequests.reduce((acc, req) => {
    acc[req.issueType] = (acc[req.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <Card sx={{ 
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: alpha(color, 0.2),
        background: `linear-gradient(145deg, ${alpha(color, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
        backdropFilter: 'blur(20px)',
        boxShadow: theme.shadows[2],
        position: 'relative',
        justifyContent: 'space-between',   
        overflow: 'hidden',
        height: '100%',
        width: '18dvw'
    }}>
        <Box sx={{ 
            position: 'absolute', right: -20, top: -20, 
            width: 100, height: 100, borderRadius: '50%', 
            background: color, opacity: 0.1, filter: 'blur(30px)' 
        }} />
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(color, 0.1), color: color, mr: 2 }}>
                    <Icon size={24} />
                </Box>
                <Typography variant="body2" fontWeight={600} color="text.secondary">{label}</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>{value}</Typography>
            <Chip label={trend} size="small" sx={{ 
                bgcolor: alpha(color, 0.1), 
                color: color, 
                fontWeight: 700, 
                borderRadius: 1.5,
                height: 24
            }} />
        </CardContent>
    </Card>
  );

  const handleNavigation = (label: string) => {
      setIsDrawerOpen(false);
      switch(label) {
          case 'Dashboard': onNavigate('Dashboard'); break;
          case 'Staff Directory': onNavigate('Users'); break;
          case 'Student Records': onNavigate('Users'); break; 
          case 'Reports': onNavigate('Reports'); break; 
          case 'Settings': onNavigate('Settings'); break;
          default: onNavigate('Dashboard');
      }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)', background: alpha(theme.palette.background.paper, 0.8) }}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <Box sx={{ p: 1, borderRadius: 2, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, color: 'white' }}>
                    <Shield size={20} fill="currentColor" />
                 </Box>
                 <Box>
                    <Typography variant="body2" fontWeight={700} color="primary" sx={{ lineHeight: 1 }}>COLLEGE ADMIN</Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1, color: 'text.primary' }}>ResolvEd Dashboard</Typography>
                 </Box>
            </Box>
           
            <Box sx={{ display: 'flex', gap: 2 }}>
                 <Button startIcon={<Search size={18} />} sx={{ color: 'text.secondary', display: { xs: 'none', md: 'flex' } }}>Search</Button>
                 <IconButton onClick={() => setIsDrawerOpen(true)} sx={{ color: 'text.primary' }}>
                    <Menu size={24} />
                 </IconButton>
            </Box>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 4, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
           <Typography variant="h5" fontWeight={800} gutterBottom color="text.primary">Menu</Typography>
           <Divider sx={{ mb: 3 }} />
           
           <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {user.name.charAt(0)}
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
           </Box>

            <Box sx={{ flexGrow: 1 }}>
                 {['Dashboard', 'Staff Directory', 'Student Records', 'Reports', 'Settings'].map((item) => (
                    <Button 
                        key={item}
                        fullWidth 
                        onClick={() => handleNavigation(item)}
                        sx={{ 
                            justifyContent: 'flex-start', mb: 1, py: 1.5, px: 2,
                            borderRadius: 2, color: 'text.secondary', fontWeight: 600,
                            '&:hover': { bgcolor: 'action.hover', color: 'primary.main' }
                        }}
                    >
                        {item}
                    </Button>
                 ))}
            </Box>

           <Box>
                <Button 
                    variant="outlined" color="error" fullWidth
                    startIcon={<LogOut size={18} />}
                    onClick={onLogout}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
      </Drawer>

      <Box sx={{ px: 3, py: 3 }}>
        <Box sx={{ mb: 3 }}>
            <Typography variant="h3" fontWeight={800} sx={{ 
                background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
            }}>
                Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">Welcome back, here's what's happening today.</Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Total Requests" value={totalRequests} icon={Calendar} color={theme.palette.primary.main} trend="+12% this week" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Pending Action" value={pendingRequests} icon={Clock} color={theme.palette.warning.main} trend="Requires attention" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Scheduled" value={scheduledRequests} icon={CheckSquare} color={theme.palette.info.main} trend="Upcoming meetings" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Completed" value={completedRequests} icon={TrendingUp} color={theme.palette.success.main} trend="Successfully resolved" />
            </Grid>
        </Grid>

        <Grid container spacing={4}>
            {/* Request Trends */}
            <Grid item xs={12} lg={8}>
                <Card sx={{ 
                    p: 3, height: '100%', borderRadius: 4,
                    boxShadow: theme.shadows[2], border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper',
                    width: '82dvw'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                             <Typography variant="h6" fontWeight={700} color="text.primary">Weekly Activity</Typography>
                             <Typography variant="body2" color="text.secondary">Request volume over the last 7 days</Typography>
                        </Box>
                         <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>View Report</Button>
                    </Box>
                   
                    <Box sx={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: theme.palette.text.secondary}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: theme.palette.text.secondary}} />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: 12, 
                                    border: 'none', 
                                    boxShadow: theme.shadows[4],
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary
                                }}
                                cursor={{ stroke: theme.palette.primary.main, strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="requests" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Card>
            </Grid>

            {/* Side Panel */}
            <Grid item xs={12} lg={4}>
                <Grid container spacing={4} direction="row">
                    {/* Faculty Performance */}
                    <Grid item>
                         <Card sx={{ 
                            p: 0, borderRadius: 4, overflow: 'hidden',
                            boxShadow: theme.shadows[2], border: '1px solid', borderColor: 'divider',
                            bgcolor: 'background.paper',
                            width: '40dvw'
                        }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={700} color="text.primary">Top Faculty</Typography>
                                <Button size="small">View All</Button>
                            </Box>
                            <Box>
                                {facultyStats.map((faculty, index) => (
                                <Box
                                    key={index}
                                    sx={{ 
                                        p: 2.5, 
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        borderBottom: index !== facultyStats.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {faculty.name.charAt(0)}
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">{faculty.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{faculty.requests} interactions</Typography>
                                        </Box>
                                    </Box>
                                    <Chip label={`${faculty.completed} Resolved`} size="small" color="success" variant="soft" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', fontWeight: 600 }} />
                                </Box>
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                    
                    {/* Issue Breakdown */}
                     <Grid item>
                         <Card sx={{ 
                            p: 3, borderRadius: 4,
                            boxShadow: theme.shadows[2], border: '1px solid', borderColor: 'divider',
                            bgcolor: 'background.paper',
                            width: '40dvw'
                        }}>
                             <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">Issue Categories</Typography>
                             <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {Object.entries(issueTypes).map(([type, count], index) => (
                                <Box key={type}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary">{type}</Typography>
                                        <Typography variant="body2" fontWeight={700} color="text.primary">{count}</Typography>
                                    </Box>
                                    <Box sx={{ width: '100%', height: 8, bgcolor: 'action.hover', borderRadius: 4, overflow: 'hidden' }}>
                                        <Box sx={{ 
                                            width: `${(count / totalRequests) * 100}%`, 
                                            height: '100%', 
                                            bgcolor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'][index % 4],
                                            borderRadius: 4 
                                        }} />
                                    </Box>
                                </Box>
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
