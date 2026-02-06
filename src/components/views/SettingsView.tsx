import { useState } from 'react';
import { Box, Typography, Card, CardContent, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, IconButton, useTheme, Tooltip, alpha } from '@mui/material';
import { useUser } from '../MockAuth';
import { useColorMode } from '../ThemeContext';
import { Edit, Camera, Save, X, Mail, Shield, LogOut, Palette } from 'lucide-react';

export const SettingsView = () => {
    const { user, signOut } = useUser();
    const { toggleColorMode, mode, setPreset, preset } = useColorMode();
    const theme = useTheme();

    // Edit Profile State
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        bio: 'Passionate about education and technology.',
        department: 'Computer Science'
    });
    
    // Simulating a saved state
    const [displayData, setDisplayData] = useState({
        fullName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        bio: 'Passionate about education and technology.',
        department: 'Computer Science'
    });

    const handleSave = () => {
        // Here we would typically make an API call
        setDisplayData(formData);
        setOpen(false);
    };

    return (
        <Box sx={{ px: 2, pb: 4 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 4, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Settings
            </Typography>
            
            {/* Profile Card */}
            <Card sx={{ 
                borderRadius: 1, 
                mb: 4, 
                overflow: 'visible', 
                boxShadow: theme.shadows[4],
                bgcolor: 'background.paper', // Use theme background
                backgroundImage: 'none'
            }}>
                <Box sx={{ 
                    height: 120, 
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, // Dynamic primary gradient
                    borderRadius: '10px 10px 0 0',
                    position: 'relative'
                }}>
                     <Tooltip title={user?.publicMetadata?.role === 'admin' ? "Edit your profile details" : "Contact IT Admin to modify your profile. Strict Policy."} arrow>
                        <span>
                            <Button 
                                startIcon={user?.publicMetadata?.role === 'admin' ? <Edit size={16} /> : <Shield size={16} />}
                                variant="contained" 
                                size="small"
                                onClick={() => user?.publicMetadata?.role === 'admin' && setOpen(true)}
                                disabled={user?.publicMetadata?.role !== 'admin'}
                                sx={{ 
                                    position: 'absolute', 
                                    right: 20, 
                                    bottom: -20, 
                                    bgcolor: 'background.paper', 
                                    color: user?.publicMetadata?.role === 'admin' ? 'primary.main' : 'text.disabled',
                                    '&:hover': { bgcolor: 'action.hover' },
                                    borderRadius: 1,
                                    boxShadow: theme.shadows[3],
                                    zIndex: 10,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 2
                                }}
                            >
                                {user?.publicMetadata?.role === 'admin' ? 'Edit Profile' : 'Verified Profile (Locked)'}
                            </Button>
                        </span>
                     </Tooltip>
                </Box>
                
                <CardContent sx={{ pt: 0, px: 4, pb: 4 }}>
                    <Box sx={{ mt: -6, mb: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                         <Avatar sx={{ 
                             width: 100, 
                             height: 100, 
                             border: '4px solid', 
                             borderColor: 'background.paper',
                             boxShadow: theme.shadows[2],
                             bgcolor: 'secondary.main',
                             fontSize: '2.5rem',
                             fontWeight: 'bold',
                             color: 'secondary.contrastText'
                         }}>
                             {displayData.fullName?.[0]}
                         </Avatar>
                    </Box>

                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
                         <Box>
                             <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">FULL NAME</Typography>
                             <Typography variant="h6" fontWeight={700} color="text.primary">{displayData.fullName}</Typography>
                         </Box>
                         <Box>
                             <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">EMAIL ADDRESS</Typography>
                             <Typography variant="body1" fontWeight={500} color="text.primary">{displayData.email}</Typography>
                         </Box>
                         <Box>
                             <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">ROLE & DEPARTMENT</Typography>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={user?.publicMetadata?.role?.toUpperCase()} size="small" color="primary" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                                <Typography variant="body2" color="text.secondary">• {displayData.department}</Typography>
                             </Box>
                         </Box>
                         <Box>
                             <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">BIO</Typography>
                             <Typography variant="body2" color="text.secondary">{displayData.bio}</Typography>
                         </Box>
                     </Box>
                </CardContent>
            </Card>

            {/* Application Settings */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, ml: 1, color: 'text.primary' }}>Application Settings</Typography>
            <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[2], bgcolor: 'background.paper' }}>
                <CardContent sx={{ p: 0 }}>
                    <List disablePadding>
                         <ListItem sx={{ p: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                                <Box sx={{ mr: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                                    <Palette size={20} />
                                </Box>
                                <ListItemText 
                                    primary={<Typography fontWeight={700}>Theme Preset</Typography>} 
                                    secondary="Customize the look and feel of your dashboard" 
                                />
                             </Box>
                             <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%', pl: 7 }}>
                                {['classic', 'ocean', 'forest', 'sunset', 'nebula', 'midnight'].map((p) => (
                                    <Tooltip key={p} title={p.charAt(0).toUpperCase() + p.slice(1)}>
                                        <Box 
                                            onClick={() => setPreset(p as any)}
                                            sx={{ 
                                                width: 40, height: 40, borderRadius: '50%', 
                                                cursor: 'pointer',
                                                border: preset === p ? '3px solid' : '1px solid',
                                                borderColor: preset === p ? 'primary.main' : 'divider',
                                                background: p === 'classic' ? 'linear-gradient(135deg, #4F46E5 50%, #10B981 50%)' :
                                                            p === 'ocean' ? 'linear-gradient(135deg, #0ea5e9 50%, #6366f1 50%)' :
                                                            p === 'forest' ? 'linear-gradient(135deg, #059669 50%, #84cc16 50%)' :
                                                            p === 'sunset' ? 'linear-gradient(135deg, #f97316 50%, #db2777 50%)' :
                                                            p === 'nebula' ? 'linear-gradient(135deg, #8b5cf6 50%, #d946ef 50%)' :
                                                            'linear-gradient(135deg, #6366f1 50%, #020617 50%)',
                                                boxShadow: preset === p ? 4 : 1,
                                                transition: 'all 0.2s',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                             </Box>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem sx={{ p: 3 }}>
                             <Box sx={{ mr: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                                 <Mail size={20} />
                             </Box>
                             <ListItemText 
                                primary={<Typography fontWeight={700}>Email Notifications</Typography>} 
                                secondary="Receive emails about new announcements and updates" 
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked color="primary" />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem sx={{ p: 3 }}>
                             <Box sx={{ mr: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', display: 'flex' }}>
                                 <Shield size={20} />
                             </Box>
                             <ListItemText 
                                primary={<Typography fontWeight={700}>Push Notifications</Typography>} 
                                secondary="Get instant alerts for chat messages and reminders" 
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked color="primary" />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                         <ListItem sx={{ p: 3 }}>
                             <Box sx={{ mr: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', display: 'flex' }}>
                                 {mode === 'dark' ? <Camera size={20} /> : <Save size={20} />} 
                             </Box>
                             <ListItemText 
                                primary={<Typography fontWeight={700}>Dark Mode</Typography>} 
                                secondary="Switch between light and dark themes" 
                            />
                            <ListItemSecondaryAction>
                                <Switch checked={mode === 'dark'} onChange={toggleColorMode} color="primary" />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Button 
                variant="text" 
                fullWidth 
                size="large"
                startIcon={<LogOut size={20} />}
                onClick={signOut}
                sx={{ 
                    mt: 4, 
                    py: 1.5, 
                    borderRadius: 3, 
                    fontWeight: 700,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    color: 'error.main',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        bgcolor: 'error.main',
                        color: 'common.white',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 20px -4px ${alpha(theme.palette.error.main, 0.5)}`
                    }
                }}
            >
                Log Out
            </Button>

            <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 6, color: 'text.disabled', fontWeight: 500 }}>
                University Meeting Management App v2.1.0 • Built with Material UI
            </Typography>

            {/* Edit Profile Dialog */}
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: 4, p: 1 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight={800}>Edit Profile</Typography>
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'primary.main' }}>
                                    {formData.fullName?.[0]}
                                </Avatar>
                                <IconButton 
                                    sx={{ 
                                        position: 'absolute', bottom: 0, right: -5, 
                                        bgcolor: 'background.paper', boxShadow: 2,
                                        '&:hover': { bgcolor: 'grey.100' } 
                                    }}
                                    size="small"
                                >
                                    <Camera size={16} />
                                </IconButton>
                            </Box>
                        </Box>
                        
                        <TextField 
                            label="Full Name" 
                            fullWidth 
                            variant="outlined" 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                         <TextField 
                            label="Department" 
                            fullWidth 
                            variant="outlined" 
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                        />
                        <TextField 
                            label="Email Address" 
                            fullWidth 
                            variant="outlined" 
                            value={formData.email}
                            disabled
                            helperText="Email cannot be changed contact admin."
                        />
                        <TextField 
                            label="Bio" 
                            fullWidth 
                            multiline 
                            rows={3} 
                            variant="outlined" 
                            placeholder="Tell us a little about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        startIcon={<Save size={18} />}
                        disableElevation
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

