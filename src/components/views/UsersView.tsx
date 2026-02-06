import React, { useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, Stack,
    useTheme, alpha, Card, CardContent, Grid, LinearProgress, Avatar,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem, Menu
} from '@mui/material';
import { useUser } from '../MockAuth';
import { Edit, Trash2, UserPlus, Search, Mail, Shield, Upload, ChevronDown, RefreshCcw, Activity, Users, UserCheck, GraduationCap } from 'lucide-react';
import { AddMemberForm } from '../CollegeAdmin/AddMemberForm';
import { BulkImport } from '../CollegeAdmin/BulkImport';

export const UsersView = () => {
    const { user } = useUser();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0); // 0 = Students, 1 = Faculty
    const [users, setUsers] = useState<any[]>([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [loading, setLoading] = useState(false); // Default false, fetch triggers true
    
    // Add Member State
    const [openAdd, setOpenAdd] = useState(false);
    const [openImport, setOpenImport] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Fetch Users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/college/members', {
                headers: { 'x-mock-role': 'admin' }
            });
            if(response.ok) {
                const data = await response.json();
                const mapped = data.map((u: any) => ({
                    id: u._id,
                    name: `${u.firstName} ${u.lastName || ''}`.trim(),
                    role: u.role,
                    department: 'General', // Placeholder
                    email: u.email,
                    status: 'Active' // Placeholder
                }));
                setUsers(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if(user?.publicMetadata?.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    // Enhanced Filter Logic
    const filteredUsers = users.filter((u: any) => {
        const role = u.role?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        // Tab 0: Students (role="student")
        // Tab 1: Faculty (role="teacher", "faculty", "admin", "staff")
        const matchesTab = tabValue === 0 
            ? role === 'student'
            : ['teacher', 'faculty', 'admin', 'staff'].includes(role);

        const matchesSearch = (u.name?.toLowerCase() || '').includes(search) || (u.email?.toLowerCase() || '').includes(search);
        
        return matchesTab && matchesSearch;
    });

    const handleEditClick = (user: any) => {
        setEditingUser({ ...user });
        setOpenEdit(true);
    };

    const handleSave = () => {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setOpenEdit(false);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/college/members/${id}`, {
                    method: 'DELETE',
                    headers: { 'x-mock-role': 'admin' }
                });

                if (response.ok) {
                    setUsers(users.filter(u => u.id !== id));
                } else {
                    const data = await response.json();
                    alert(`Failed to delete user: ${data.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            }
        }
    };
    
    const handleAddMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    if (user?.publicMetadata?.role !== 'admin') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Shield size={48} color={theme.palette.error.main} style={{ marginBottom: 16 }} />
                    <Typography variant="h5" fontWeight={700} gutterBottom>Access Restricted</Typography>
                    <Typography color="text.secondary">This area is reserved for College Administrators.</Typography>
                </Paper>
            </Box>
        );
    }

    const studentCount = users.filter(u => u.role === 'student').length;
    const facultyCount = users.filter(u => ['teacher', 'faculty', 'admin', 'staff'].includes(u.role)).length;

    return (
        <Box sx={{ width: '100%', px: 3, pb: 4 }}>
            
            {/* Header Section */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'center' }, 
                mb: 3, gap: 2 
            }}>
                <Box>
                    <Typography variant="overline" fontWeight={700} color="secondary" sx={{ letterSpacing: 1.2 }}>
                        ADMINISTRATION
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ 
                        mt: 0.5,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        User Directory
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        onClick={fetchUsers}
                        variant="outlined"
                        startIcon={<RefreshCcw size={18} className={loading ? "spin" : ""} />}
                        sx={{ borderRadius: 3, px: 3 }}
                    >
                        Refresh List
                    </Button>
                    <Button 
                        variant="contained" 
                        endIcon={<ChevronDown size={18} />} 
                        startIcon={<UserPlus size={18} />} 
                        onClick={handleAddMenuClick}
                        sx={{ 
                            borderRadius: 3, px: 3, py: 1.2, 
                            boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                            '&:hover': { boxShadow: '0 12px 24px -4px rgba(79, 70, 229, 0.6)' }
                        }}
                    >
                        Add Members
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{ sx: { mt: 1.5, borderRadius: 2, minWidth: 200, boxShadow: theme.shadows[4] } }}
                    >
                        <MenuItem onClick={() => { setOpenAdd(true); setAnchorEl(null); }} sx={{ py: 1.5 }}>
                             <UserPlus size={16} style={{ marginRight: 12 }} /> Add Single Member
                        </MenuItem>
                        <MenuItem onClick={() => { setOpenImport(true); setAnchorEl(null); }} sx={{ py: 1.5 }}>
                             <Upload size={16} style={{ marginRight: 12 }} /> Bulk Import (Excel)
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            <AddMemberForm 
                open={openAdd} 
                onClose={() => setOpenAdd(false)}
                onSuccess={() => { fetchUsers(); }}
            />

            <BulkImport 
                open={openImport} 
                onClose={() => setOpenImport(false)}
                onSuccess={() => { fetchUsers(); }}
            />

            {/* Premium Stats Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Users', value: users.length, icon: Users, color: '#3b82f6', trend: 'Registered Members' },
                    { label: 'Students', value: studentCount, icon: GraduationCap, color: '#10b981', trend: 'Active Learners' },
                    { label: 'Faculty & Staff', value: facultyCount, icon: Shield, color: '#f59e0b', trend: 'Instructors' },
                    { label: 'System Status', value: 'Online', icon: Activity, color: '#ec4899', trend: 'Fully Operational' }
                ].map((stat, i) => (
                    <Grid item xs={12} sm={6} lg={3} key={i}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            border: '1px solid', 
                            borderColor: alpha(stat.color, 0.2),
                            background: `linear-gradient(145deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: theme.shadows[2],
                            position: 'relative', overflow: 'hidden'
                        }}>
                             <Box sx={{ 
                                position: 'absolute', right: -20, top: -20, 
                                width: 100, height: 100, borderRadius: '50%', 
                                background: stat.color, opacity: 0.1, filter: 'blur(30px)' 
                            }} />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(stat.color, 0.1), color: stat.color, mr: 2 }}>
                                        <stat.icon size={24} />
                                    </Box>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary">{stat.label}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>{stat.value}</Typography>
                                <Chip label={stat.trend} size="small" sx={{ 
                                    bgcolor: alpha(stat.color, 0.1), 
                                    color: stat.color, 
                                    fontWeight: 700, 
                                    borderRadius: 1.5,
                                    height: 24
                                }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Table Section */}
            <Paper sx={{ 
                borderRadius: 4, 
                border: '1px solid', borderColor: 'divider', 
                overflow: 'hidden',
                boxShadow: theme.shadows[4] 
            }}>
                 {/* Toolbar with Tabs and Search */}
                <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid', borderColor: 'divider', 
                    display: 'flex', flexDirection: { xs: 'column', md: 'row' }, 
                    alignItems: 'center', justifyContent: 'space-between', 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    gap: 2
                }}>
                    <Stack direction="row" spacing={1} sx={{ bgcolor: 'background.paper', p: 0.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Button 
                            disableElevation
                            variant={tabValue === 0 ? 'contained' : 'text'} 
                            color={tabValue === 0 ? 'primary' : 'inherit'}
                            onClick={() => setTabValue(0)}
                            sx={{ borderRadius: 2.5, px: 3, fontWeight: 700, minWidth: 120 }}
                        >
                            Students
                        </Button>
                        <Button 
                            disableElevation
                            variant={tabValue === 1 ? 'contained' : 'text'} 
                            color={tabValue === 1 ? 'secondary' : 'inherit'}
                            onClick={() => setTabValue(1)}
                            sx={{ borderRadius: 2.5, px: 3, fontWeight: 700, minWidth: 120 }}
                        >
                            Faculty
                        </Button>
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', bgcolor: 'background.paper', px: 2, py: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider', width: { xs: '100%', md: 300 } }}>
                        <Search size={18} />
                        <input 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: theme.palette.text.primary, background: 'transparent' }}
                        />
                    </Box>
                </Box>

                {loading && <LinearProgress />}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.common.black, 0.02) }}>
                                <TableCell sx={{ py: 2, pl: 4, fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>USER PROFILE</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>ROLE & DEPARTMENT</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>STATUS</TableCell>
                                <TableCell align="right" sx={{ pr: 4, fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((u) => (
                                <TableRow key={u.id} hover sx={{ transition: 'all 0.2s' }}>
                                    <TableCell sx={{ py: 2.5, pl: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ 
                                                bgcolor: u.role === 'student' ? 'primary.main' : 'secondary.main', 
                                                fontWeight: 'bold', width: 40, height: 40,
                                                boxShadow: theme.shadows[2]
                                            }}>
                                                {u.name[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700}>{u.name}</Typography>
                                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                                                    <Mail size={12} color={theme.palette.text.secondary} />
                                                    <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{u.role}</Typography>
                                            <Typography variant="caption" color="text.secondary">{u.department}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                         <Chip 
                                            label={u.status} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: u.status === 'Active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                                color: u.status === 'Active' ? 'success.main' : 'error.main',
                                                fontWeight: 800, borderRadius: 2
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 4 }}>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Edit Profile">
                                                <IconButton 
                                                    onClick={() => handleEditClick(u)}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                                        color: 'primary.main',
                                                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                                                    }}
                                                >
                                                    <Edit size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete User">
                                                <IconButton 
                                                    onClick={() => handleDelete(u.id)}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: alpha(theme.palette.error.main, 0.1), 
                                                        color: 'error.main',
                                                        '&:hover': { bgcolor: 'error.main', color: 'white' }
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            {filteredUsers.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: 0.6 }}>
                                            <Typography variant="h6">No users found</Typography>
                                            <Typography variant="body2">Try adjusting your filters or add a new member.</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

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
