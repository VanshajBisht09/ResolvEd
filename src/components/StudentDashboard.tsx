import { useState } from 'react';
import { MeetingRequest, User, Faculty, IssueType } from '../types';
import { RequestCard } from './RequestCard';
import { 
    Button, Box, Typography, IconButton, Drawer, Tabs, Tab, Card, Grid, Badge, useTheme, Fab, alpha,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { EmptyState } from './EmptyState';
import { Plus, Calendar, FileText, Upload, Bell, Menu, LogOut, MapPin, FileQuestion, GraduationCap } from 'lucide-react';
import { CreateRequestForm } from './CreateRequestForm';

interface StudentDashboardProps {
  user: User;
  requests: MeetingRequest[];
  facultyList: User[]; 
  onAddRequest: (data: Partial<MeetingRequest>) => void;
  onRequestClick: (request: MeetingRequest) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function StudentDashboard({
  user,
  requests,
  facultyList,
  onAddRequest,
  onRequestClick,
  onNavigate,
  onLogout,
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();

  // New navigation-like state
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [requestMode, setRequestMode] = useState<'meeting' | 'upload'>('meeting');

  const filterRequests = (status: string) => {
    if (status === 'all') return requests;
    if (status === 'upcoming') {
      return requests.filter((r) => r.status === 'Scheduled');
    }
    return requests.filter((r) => r.status === status);
  };
  
  const todayRequests = requests.filter((r) => {
      if (!r.scheduledDate) return false;
      // Mocking today's date for demo
      const today = new Date('2026-02-02').toDateString(); // Fixed mock date for demo consistency
      const requestDate = new Date(r.scheduledDate).toDateString();
      return today === requestDate && r.status === 'Scheduled';
  });

  const scheduledCount = requests.filter((r) => r.status === 'Scheduled').length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const handleStartCreate = (mode: 'meeting' | 'upload') => {
      setRequestMode(mode);
      setIsCreatingRequest(true);
  };

  const handleCreateSubmit = (data: any) => {
      // Data comes from CreateRequestForm
      const newRequest: Partial<MeetingRequest> = {
          issueType: data.issueType,
          description: data.description,
          status: 'Pending',
          // faculty info is already in data if CreateRequestForm matches
          facultyId: data.facultyId,
          facultyName: data.facultyName,
          facultyType: data.facultyType,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          attachments: data.attachments, // Array of strings (names) from CreateRequestForm logic
          studentId: user.id,
          studentName: user.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
      };

      onAddRequest(newRequest);
      setIsCreatingRequest(false);
  };

  if (isCreatingRequest) {
      // Map Users (with facultyType) to Faculty interface (with type)
      const mappedFaculty: Faculty[] = facultyList.map(user => ({
          id: user.id,
          name: user.name,
          type: user.facultyType || 'Teacher', // Default to Teacher if missing
          department: user.department || 'General',
          email: user.email,
          avatar: user.avatar
      }));

      return (
          <CreateRequestForm 
            faculty={mappedFaculty} 
            onSubmit={handleCreateSubmit} 
            onBack={() => setIsCreatingRequest(false)} 
            mode={requestMode}
          />
      );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile Header */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider', 
        position: 'sticky', 
        top: 0, 
        zIndex: 10,
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">ResolvEd</Typography>
            <Typography variant="caption" color="text.secondary">Welcome, {user.name} 👋</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

            <IconButton onClick={() => setMobileMenuOpen(true)}>
                <Menu size={20} />
            </IconButton>
        </Box>
      </Box>

       {/* Drawer */}
       <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
         <Box sx={{ width: 280, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
           <Typography variant="h6" gutterBottom fontWeight="700">Menu</Typography>
           <Divider sx={{ mb: 2 }} />
           
           <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
             <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <GraduationCap size={24} />
             </Box>
             <Box>
                 <Typography variant="subtitle2" fontWeight="600">{user.name}</Typography>
                 <Typography variant="caption" color="text.secondary">{user.email}</Typography>
             </Box>
           </Box>
            
           <List component="nav">
                <ListItemButton onClick={() => setMobileMenuOpen(false)}>
                    <ListItemIcon><Calendar size={20} /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                 {/* Add more menu items if needed */}
           </List>

            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
                <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth
                    startIcon={<LogOut size={18} />}
                    onClick={onLogout}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
      </Drawer>

      <Box sx={{ p: 2, height: '100%' }}>
        {/* Welcome Section */}
        {/* <Box sx={{ mb: 4 }}> ... redundant if header has welcome ... but let's keep stats */}
        
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
           <Grid size={{ xs: 6 }}>
              <Card sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  color: 'primary.main', 
                  boxShadow: 'none', 
                  border: '1px solid', 
                  borderColor: alpha(theme.palette.primary.main, 0.2) 
             }}>
                 <Typography variant="caption" sx={{ opacity: 0.8 }} color="text.secondary">Scheduled</Typography>
                 <Typography variant="h4" fontWeight="bold">{scheduledCount}</Typography>
              </Card>
           </Grid>
           <Grid size={{ xs: 6 }}>
              <Card sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                  color: 'secondary.main', 
                  boxShadow: 'none', 
                  border: '1px solid', 
                  borderColor: alpha(theme.palette.secondary.main, 0.2) 
             }}>
                 <Typography variant="caption" sx={{ opacity: 0.8 }} color="text.secondary">Pending</Typography>
                 <Typography variant="h4" fontWeight="bold">{pendingCount}</Typography>
              </Card>
           </Grid>
        </Grid>

        {/* Today's Meetings */}
        {todayRequests.length > 0 && (
          <Card sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRadius: 1,
              boxShadow: theme.shadows[2]
          }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
               <Box sx={{ p: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 1 }}>
                 <Calendar size={16} />
               </Box>
               <Typography variant="subtitle1" fontWeight="600">Today's Meetings</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {todayRequests.map((request) => (
                <Box
                  key={request.id}
                  onClick={() => onRequestClick(request)}
                  sx={{ 
                      p: 2, 
                      bgcolor: alpha(theme.palette.primary.main, 0.04), 
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="600">{request.facultyName}</Typography>
                    <Box sx={{ px: 1, py: 0.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" fontWeight="bold">{request.scheduledTime}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', color: 'text.secondary', mb: 0.5 }}>{request.issueType}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, opacity: 0.8, color: 'text.secondary' }}>
                     <MapPin size={12} />
                     <Typography variant="caption">Room {request.roomNumber}, {request.buildingName}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Quick Actions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2}>
             <Grid size={{ xs: 12, sm: 4 }}>
                <Card 
                    onClick={() => handleStartCreate('meeting')}
                    sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', height: '100%', '&:hover': { boxShadow: 4 } }}
                >
                     <Box sx={{ 
                        width: 48, height: 48, 
                        borderRadius: 1, 
                        bgcolor: 'primary.main', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 2
                    }}>
                       <Plus size={24} color="white" />
                    </Box>
                    <Typography variant="caption" align="center" fontWeight="500">Request Meeting</Typography>
                </Card>
             </Grid>
             <Grid size={{ xs: 12, sm: 4 }}>
                <Card 
                    onClick={() => handleStartCreate('upload')}
                    sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', height: '100%', '&:hover': { boxShadow: 4 } }}
                >
                    <Box sx={{ 
                        width: 48, height: 48, 
                        borderRadius: 1, 
                        bgcolor: 'secondary.main', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 2
                    }}>
                       <Upload size={24} color="white" />
                    </Box>
                    <Typography variant="caption" align="center" fontWeight="500">Upload Work</Typography>
                </Card>
             </Grid>
             <Grid size={{ xs: 12, sm: 4 }}>
                <Card 
                    onClick={() => onNavigate('Complaints')}
                    sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', height: '100%', '&:hover': { boxShadow: 4 } }}
                >
                     <Box sx={{ 
                        width: 48, height: 48, 
                        borderRadius: 1, 
                        bgcolor: 'primary.dark', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 2
                    }}>
                       <FileText size={24} color="white" />
                    </Box>
                    <Typography variant="caption" align="center" fontWeight="500">Submit Issue</Typography>
                </Card>
             </Grid>
          </Grid>
        </Box>

        {/* Requests List */}
        <Card sx={{ p: 0, overflow: 'hidden' }}>
           <Tabs 
                value={activeTab} 
                onChange={(_, v) => setActiveTab(v)} 
                variant="scrollable" 
                scrollButtons="auto"
                sx={{ 
                    px: 2,
                    pt: 2,
                    borderBottom: 1, 
                    borderColor: 'divider',
                    '& .MuiTab-root': { minHeight: 48 } 
                }}
            >
             <Tab label="All" value="all" />
             <Tab label="Upcoming" value="upcoming" />
             <Tab label="Pending" value="Pending" />
             <Tab label="Completed" value="Completed" />
           </Tabs>
           
           <Box sx={{ p: 2, minHeight: 300 }}>
             {filterRequests(activeTab).length === 0 ? (
                <EmptyState 
                    icon={activeTab === 'upcoming' ? Calendar : FileQuestion} 
                    title={activeTab === 'upcoming' ? "No Upcoming Meetings" : "No Requests Found"}
                    description={activeTab === 'upcoming' 
                        ? "You don't have any meetings scheduled at the moment."
                        : "You haven't submitted any requests yet. Need help? Create a new request to get started."}
                    actionLabel={activeTab !== 'upcoming' ? "Create Request" : undefined}
                    onAction={activeTab !== 'upcoming' ? () => handleStartCreate('meeting') : undefined}
                />
             ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filterRequests(activeTab).map((request) => (
                        <RequestCard
                        key={request.id}
                        request={request}
                        viewMode="student"
                        onClick={() => onRequestClick(request)}
                        />
                    ))}
                </Box>
             )}
           </Box>
        </Card>
      </Box>
      
      {/* FAB for Mobile */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => handleStartCreate('meeting')}
        sx={{ position: 'fixed', bottom: 24, right: 24, display: { md: 'none' } }}
      >
        <Plus />
      </Fab>

    </Box>
  );
}