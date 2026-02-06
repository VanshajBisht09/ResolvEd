import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Tabs, Tab, Button, Avatar, Chip, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useUser } from '../MockAuth';
import { Edit, Trash2, UserPlus, Search, Mail, Shield } from 'lucide-react';

// Mock Data
const initialUsers = [
    { id: 1, name: 'Vikram Student', role: 'student', department: 'Computer Science', email: 'vikram@university.edu', status: 'Active' },
    { id: 2, name: 'Rahul Verma', role: 'student', department: 'Mechanical Eng.', email: 'rahul@university.edu', status: 'Active' },
    { id: 3, name: 'Priya Singh', role: 'student', department: 'Electrical Eng.', email: 'priya@university.edu', status: 'Inactive' },
    { id: 4, name: 'Prof. Sharma', role: 'teacher', department: 'Computer Science', email: 'sharma@university.edu', status: 'Active' },
    { id: 5, name: 'Dr. Aditi Gupta', role: 'teacher', department: 'Physics', email: 'aditi@university.edu', status: 'Active' },
];

export const UsersView = () => {
    const { user } = useUser();
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    // Filter users based on tab and search
    const filteredUsers = users.filter(u => {
        const roleMatch = tabValue === 0 ? u.role === 'student' : u.role === 'teacher';
        const searchMatch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        return roleMatch && searchMatch;
    });

    const handleEditClick = (user: any) => {
        setEditingUser({ ...user });
        setOpenEdit(true);
    };

    const handleSave = () => {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setOpenEdit(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    if (user?.publicMetadata?.role !== 'admin') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography variant="h5" color="text.secondary">Access Denied. Admins only.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(45deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        User Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Manage students, faculty, and permissions.</Typography>
                </Box>
                <Button variant="contained" startIcon={<UserPlus size={18} />} sx={{ borderRadius: 1, px: 3, py: 1.2, boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                    Add User
                </Button>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Total Users', value: '1,240', color: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)' },
                    { label: 'Active Students', value: '850', color: 'linear-gradient(135deg, #059669 0%, #34d399 100%)' },
                    { label: 'Faculty Online', value: '45', color: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' }
                ].map((stat, i) => (
                    <Grid size={{ xs: 12, md: 4 }} key={i}>
                        <Card sx={{ 
                            borderRadius: 1, 
                            background: stat.color, 
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                             <Box sx={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                             <Box sx={{ position: 'absolute', bottom: -20, left: 10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>{stat.value}</Typography>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ opacity: 0.9 }}>{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card sx={{ borderRadius: 1, mb: 4, boxShadow: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="user tabs">
                        <Tab label="Students" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }} />
                        <Tab label="Faculty" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }} />
                    </Tabs>
                </Box>
                
                {/* Distinct Context Header */}
                <Box sx={{ 
                    p: 2, 
                    bgcolor: tabValue === 0 ? 'rgba(59, 130, 246, 0.05)' : 'rgba(168, 85, 247, 0.05)', 
                    borderBottom: '1px solid',
                    borderColor: tabValue === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                    display: 'flex', alignItems: 'center', gap: 1
                }}>
                    <Shield size={16} color={tabValue === 0 ? '#3b82f6' : '#a855f7'} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: tabValue === 0 ? 'primary.main' : 'secondary.main', letterSpacing: 0.5 }}>
                        {tabValue === 0 ? 'STUDENT DIRECTORY • STRICTLY CONFIDENTIAL' : 'FACULTY DIRECTORY • STAFF ONLY'}
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <TextField 
                        fullWidth 
                        placeholder="Search users by name or email..." 
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <Search size={20} color="gray" style={{ marginRight: 8 }} />,
                            sx: { borderRadius: 3, bgcolor: 'background.default' }
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Grid container spacing={2}>
                        {filteredUsers.map((u) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={u.id}>
                                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', transition: 'all 0.2s', '&:hover': {borderColor: 'primary.main', boxShadow: 3} }} elevation={0}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: u.role === 'teacher' ? 'secondary.main' : 'primary.main', fontWeight: 'bold' }}>{u.name[0]}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}>{u.name}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.7 }}>
                                                        <Mail size={12} />
                                                        <Typography variant="caption">{u.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Chip label={u.status} size="small" color={u.status === 'Active' ? 'success' : 'default'} sx={{ borderRadius: 1, height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                                        </Box>
                                        
                                        <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2, mb: 2 }}>
                                            <Grid container>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">DEPARTMENT</Typography>
                                                    <Typography variant="body2" fontWeight={600}>{u.department}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">ROLE</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Shield size={12} />
                                                        <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{u.role}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button variant="outlined" size="small" fullWidth startIcon={<Edit size={14} />} onClick={() => handleEditClick(u)} sx={{ borderRadius: 2 }}>
                                                Edit
                                            </Button>
                                            <Button variant="outlined" color="error" size="small" sx={{ minWidth: 40, borderRadius: 2 }} onClick={() => handleDelete(u.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    {filteredUsers.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                            <Typography variant="h6">No users found</Typography>
                            <Typography variant="body2">Try adjusting your search terms.</Typography>
                        </Box>
                    )}
                </Box>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle fontWeight={700}>Edit User Profile</DialogTitle>
                <DialogContent>
                    {editingUser && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                            <TextField 
                                label="Full Name" fullWidth value={editingUser.name} 
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} 
                            />
                            <TextField 
                                label="Email" fullWidth value={editingUser.email} 
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} 
                            />
                            <TextField 
                                label="Department" fullWidth value={editingUser.department} 
                                onChange={(e) => setEditingUser({...editingUser, department: e.target.value})} 
                            />
                             <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editingUser.status}
                                    label="Status"
                                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disableElevation>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
