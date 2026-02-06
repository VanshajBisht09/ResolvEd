import { useState } from 'react';
import { MeetingRequest, User } from '../types';
import { RequestCard } from './RequestCard';
import { Button, Box, Typography, IconButton, Drawer, Tabs, Tab, Checkbox, Card, Grid, Chip, Divider, useTheme, Avatar, alpha, Badge } from '@mui/material';
import { Calendar, CheckSquare, Clock, Menu, LogOut, Users, Check, MessageCircle, ArrowLeft } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { useData } from './DataContext';
import { ChatLayout } from './chat/ChatLayout';

interface FacultyDashboardProps {
  user: User;
  requests: MeetingRequest[];
  onRequestClick: (request: MeetingRequest) => void;
  onAcceptRequest: (requestId: string) => void;
  onBulkAccept: (requestIds: string[]) => void;
  onLogout: () => void;
}

export function FacultyDashboard({
  user,
  requests,
  onRequestClick,
  onAcceptRequest,
  onBulkAccept,
  onLogout,
}: FacultyDashboardProps) {
  const { chats, sendMessage, markChatRead } = useData();
  const [activeTab, setActiveTab] = useState('pending');
  const [viewMode, setViewMode] = useState<'dashboard' | 'messages'>('dashboard');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();

  const totalUnreadMessages = chats.reduce((acc, chat) => acc + chat.unreadCount, 0);

  const filterRequests = (status?: string) => {
    if (!status || status === 'all') return requests;
    if (status === 'today') {
      return requests.filter((r) => {
        if (!r.scheduledDate) return false;
        const today = new Date('2026-02-02').toDateString();
        const requestDate = new Date(r.scheduledDate).toDateString();
        return today === requestDate && r.status === 'Scheduled';
      });
    }
    if (status === 'assignments') {
        return requests.filter((r) => r.issueType === 'Assignment submission');
    }
    return requests.filter((r) => r.status === status);
  };

  const todayRequests = requests.filter((r) => {
    if (!r.scheduledDate) return false;
    const today = new Date('2026-02-02').toDateString();
    const requestDate = new Date(r.scheduledDate).toDateString();
    return today === requestDate && r.status === 'Scheduled';
  });

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'Accepted').length;
  const scheduledCount = requests.filter((r) => r.status === 'Scheduled').length;
  
  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleBulkAccept = () => {
    onBulkAccept(selectedRequests);
    setSelectedRequests([]);
  };

  const handleOpenChat = (contactId?: string) => {
      setViewMode('messages');
      if (contactId) {
          setSelectedContactId(contactId);
          markChatRead(contactId);
      }
      setMobileMenuOpen(false);
  };

  const handleSendMessage = (text: string) => {
      if (selectedContactId) {
          sendMessage(selectedContactId, text, user.id, user.name);
      }
  };

  const isSelectionMode = selectedRequests.length > 0;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             {viewMode === 'messages' && (
                 <IconButton onClick={() => setViewMode('dashboard')} size="small">
                     <ArrowLeft size={20} />
                 </IconButton>
             )}
            <Box>
                <Typography variant="h6" fontWeight="bold" color="primary">ResolvEd</Typography>
                <Typography variant="caption" color="text.secondary">Faculty Portal 🎓</Typography>
            </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => handleOpenChat()}>
                <Badge badgeContent={totalUnreadMessages} color="error">
                    <MessageCircle size={20} />
                </Badge>
            </IconButton>
            <IconButton onClick={() => setMobileMenuOpen(true)}>
                <Menu size={20} />
            </IconButton>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
         <Box sx={{ width: 280, p: 3 }}>
           <Typography variant="h6" gutterBottom>Menu</Typography>
           <Divider sx={{ mb: 2 }} />
           <Box sx={{ mb: 3 }}>
             <Typography variant="body2" color="text.secondary">Profile</Typography>
             <Typography variant="body1">{user.name}</Typography>
             <Typography variant="caption" color="text.secondary">{user.email}</Typography>
             <Typography variant="caption" display="block">{user.department}</Typography>
             <Chip label={user.facultyType} size="small" color="primary" variant="outlined" sx={{ mt: 1 }} />
           </Box>
            <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<MessageCircle size={18} />} 
                onClick={() => handleOpenChat()}
                sx={{ mb: 2 }}
            >
                Messages
            </Button>
            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
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

      <Box sx={{ p: 2, height: 'calc(100vh - 70px)' }}> {/* Adjust height for chat layout */}
        {viewMode === 'messages' ? (
            <ChatLayout 
                sessions={chats}
                currentUser={{ id: user.id, name: user.name }}
                selectedContactId={selectedContactId}
                onSelectSession={(id) => {
                    setSelectedContactId(id);
                    markChatRead(id);
                }}
                onSendMessage={handleSendMessage}
            />
        ) : (
            <>
                {/* Quick Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ p: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', textAlign: 'center', height: '100%', boxShadow: 'none', border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
                            <Typography variant="caption" display="block" color="text.secondary">Pending</Typography>
                            <Typography variant="h5" fontWeight="bold">{pendingCount}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', textAlign: 'center', height: '100%', boxShadow: 'none', border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.2) }}>
                            <Typography variant="caption" display="block" color="text.secondary">Accepted</Typography>
                            <Typography variant="h5" fontWeight="bold">{acceptedCount}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', textAlign: 'center', height: '100%', boxShadow: 'none', border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                            <Typography variant="caption" display="block" color="text.secondary">Scheduled</Typography>
                            <Typography variant="h5" fontWeight="bold">{scheduledCount}</Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Today's Schedule */}
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
                    <Typography variant="subtitle1" fontWeight="600">Today's Schedule</Typography>
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
                            <Typography variant="body2" fontWeight="600">{request.studentName}</Typography>
                            <Box sx={{ px: 1, py: 0.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="caption" fontWeight="bold">{request.scheduledTime}</Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', color: 'text.secondary', mb: 0.5 }}>{request.issueType}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.75, color: 'text.primary' }}>Room {request.roomNumber}, {request.buildingName}</Typography>
                        </Box>
                    ))}
                    </Box>
                </Card>
                )}

                {/* Bulk Actions Bar */}
                {isSelectionMode && activeTab === 'Pending' && (
                    <Card sx={{ 
                        mb: 2, p: 2, 
                        bgcolor: 'primary.main', color: 'primary.contrastText',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        position: 'sticky', top: 70, zIndex: 5
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Users size={18} />
                            <Typography variant="body2" fontWeight="500">{selectedRequests.length} selected</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                size="small" 
                                variant="text" 
                                sx={{ color: 'inherit', minWidth: 'auto' }}
                                onClick={() => setSelectedRequests([])}
                            >
                                Clear
                            </Button>
                            <Button 
                                size="small" 
                                variant="contained" 
                                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                                onClick={handleBulkAccept}
                                startIcon={<CheckSquare size={16} />}
                            >
                                Accept All
                            </Button>
                        </Box>
                    </Card>
                )}

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
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Pending
                                {pendingCount > 0 && (
                                    <Chip label={pendingCount} size="small" color="warning" sx={{ height: 16, fontSize: '0.65rem' }} />
                                )}
                            </Box>
                        } 
                        value="pending" 
                    />
                     <Tab label="Assignments" value="assignments" />
                    <Tab label="Today" value="today" />
                    <Tab label="Accepted" value="Accepted" />
                    <Tab label="Scheduled" value="Scheduled" />
                </Tabs>

                <Box sx={{ p: 2, minHeight: 300 }}>
                    {filterRequests(activeTab).length === 0 ? (
                        <EmptyState 
                            icon={activeTab === 'today' ? Calendar : activeTab === 'assignments' ? MessageCircle : CheckSquare} 
                            title={activeTab === 'today' ? "No Meetings Today" : "No Requests Found"}
                            description={
                                activeTab === 'Pending' ? "You're all caught up! No pending requests to review. 🎉" :
                                activeTab === 'today' ? "You have no meetings scheduled for today. Enjoy your free time!" :
                                "No requests found in this category."
                            }
                        />
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {filterRequests(activeTab).map((request) => (
                                <Box key={request.id}>
                                    {activeTab === 'Pending' ? (
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <Checkbox 
                                                checked={selectedRequests.includes(request.id)}
                                                onChange={() => toggleRequestSelection(request.id)}
                                                sx={{ mt: 1 }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <RequestCard
                                                    request={request}
                                                    viewMode="faculty"
                                                    onClick={() => onRequestClick(request)}
                                                />
                                                {!selectedRequests.includes(request.id) && (
                                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                            <Button 
                                                                variant="contained" 
                                                                size="small" 
                                                                sx={{ flex: 1 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onAcceptRequest(request.id);
                                                                }}
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button 
                                                                variant="outlined" 
                                                                size="small" 
                                                                sx={{ flex: 1 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onRequestClick(request);
                                                                }}
                                                            >
                                                                Reschedule
                                                            </Button>
                                                        </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <RequestCard
                                                request={request}
                                                viewMode="faculty"
                                                onClick={() => onRequestClick(request)}
                                            />
                                            {activeTab === 'assignments' && (
                                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                                     <Button 
                                                        size="small" 
                                                        startIcon={<MessageCircle size={14} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenChat(request.studentId);
                                                        }}
                                                    >
                                                        Message Student
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
                </Card>
            </>
        )}
      </Box>

    </Box>
  );
}