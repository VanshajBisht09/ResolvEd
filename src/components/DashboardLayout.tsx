import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Avatar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  useTheme, 
  alpha,
  Tooltip,
  Paper
} from '@mui/material';
import { 
  Menu,
  Bell, 
  MessageSquare, 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  Settings, 
  Users, 
  Search,
  Command,
  LogOut
} from 'lucide-react';
import { useUser } from './MockAuth';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';
import { useNotification } from './NotificationContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const drawerWidth = 280;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentView, onViewChange }) => {
  const theme = useTheme();
  const { user, signOut } = useUser();
  const { unreadCount } = useNotification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'Dashboard' },
    { text: 'Messages', icon: <MessageSquare size={20} />, id: 'Messages' },
    { text: 'Complaints', icon: <FileText size={20} />, id: 'Complaints' },
    { text: 'Announcements', icon: <Megaphone size={20} />, id: 'Announcements' },
    { text: 'Settings', icon: <Settings size={20} />, id: 'Settings' },
  ];

  if (user?.publicMetadata?.role === 'admin') {
      menuItems.splice(4, 0, { text: 'Users', icon: <Users size={20} />, id: 'Users' });
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`
      }}>
          <Box sx={{ 
              width: 40, height: 40, 
              borderRadius: 1, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
          }}>
            <Typography variant="h6" fontWeight="800">U</Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" lineHeight={1}>ResolvEd</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ letterSpacing: 0.5 }}>CAMPUS PORTAL</Typography>
          </Box>
      </Box>

      {/* Quick Search Trigger in Sidebar */}
      <Box sx={{ px: 1, mb: 1 }}>
        <Paper
            onClick={() => setPaletteOpen(true)}
            elevation={0}
            sx={{
                p: 1, 
                px: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                bgcolor: alpha(theme.palette.action.hover, 0.5),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                color: 'text.secondary',
                transition: 'all 0.2s',
                '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
                    color: 'text.primary'
                }
            }}
        >
            <Search size={16} />
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>Quick Find...</Typography>
            <Box sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1, 
                px: 0.6, 
                fontSize: '0.7rem', 
                fontWeight: 700 
            }}>
                Ctrl K
            </Box>
        </Paper>
      </Box>

      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
                onClick={() => onViewChange(item.id)}
                selected={currentView === item.id}
                sx={{ 
                  borderRadius: 1, 
                  py: 1.2,
                  color: currentView === item.id ? 'primary.main' : 'text.secondary',
                  bgcolor: currentView === item.id ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: currentView === item.id ? alpha(theme.palette.primary.main, 0.15) : 'action.hover',
                    color: currentView === item.id ? 'primary.main' : 'text.primary',
                  },
                  '&.Mui-selected': {     
                     bgcolor: alpha(theme.palette.primary.main, 0.1),
                     '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                     }
                  }
                }}
            >
                <ListItemIcon sx={{ 
                    color: 'inherit', 
                    minWidth: 40,
                    filter: currentView === item.id ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
                }}>
                {item.icon}
                </ListItemIcon>
                <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                        fontWeight: currentView === item.id ? 700 : 500,
                        fontSize: '0.95rem'
                    }} 
                />
                {currentView === item.id && (
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Mini Profile */}
      <Box sx={{ p: 2, px: 3, mt: 'auto', borderTop: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             <Badge 
                overlap="circular" 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
                variant="dot" 
                color="success"
                sx={{ '& .MuiBadge-badge': { border: `2px solid ${theme.palette.background.paper}` } }}
            >
                <Avatar sx={{ width: 36, height: 36, fontSize: '0.9rem', bgcolor: 'secondary.main' }}>
                    {user?.fullName?.[0]}
                </Avatar>
             </Badge>
             <Box sx={{ flex: 1, overflow: 'hidden' }}>
                 <Typography variant="subtitle2" fontWeight={700} noWrap>{user?.fullName}</Typography>
                 <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', textTransform: 'capitalize' }}>
                     {user?.publicMetadata?.role}
                 </Typography>
             </Box>
          </Box>
      </Box>


    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)'
        }}
      >
        <Toolbar>
          {/* Top Bar Command Trigger */}
          <Tooltip title="Search (Ctrl + K)">
            <IconButton onClick={() => setPaletteOpen(true)} sx={{ mr: 'auto', color: 'text.secondary' }}>
                <Command size={20} />
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton 
                    color="inherit" 
                    sx={{ color: 'text.secondary' }}
                    onClick={() => setNotificationOpen(true)}
                >
                    <Badge badgeContent={unreadCount} color="error" variant="dot" invisible={unreadCount === 0}>
                    <Bell size={20} />
                    </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Sign Out">
                  <IconButton onClick={() => signOut()} sx={{ color: 'error.main' }}>
                      <LogOut size={20} />
                  </IconButton>
              </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 

            flexGrow: 1, 
            p: currentView === 'Complaints' ? 0 : 3, 
            width: { sm: `calc(100% - ${drawerWidth}px)` }, 
            mt: 8,
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
      
      {/* Command Palette Modal */}
      <CommandPalette 
          open={paletteOpen} 
          onClose={() => setPaletteOpen(false)} 
          onNavigate={onViewChange} 
      />

       <NotificationDrawer 
          open={notificationOpen} 
          onClose={() => setNotificationOpen(false)}
      />
    </Box>
  );
};
