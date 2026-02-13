import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, Stack,
    useTheme, alpha, Card, CardContent, Grid, LinearProgress, Avatar
} from '@mui/material';
import { Plus, Ban, CheckCircle, Shield, Building, Mail, Edit, Zap, Activity, Users, Globe, Search, RefreshCcw } from 'lucide-react';
import { CollegeForm } from '../components/SuperAdmin/CollegeForm';
import axios from 'axios';
import { useToast } from '../components/common/ToastContext';

interface College {
    _id: string;
    name: string;
    email: string;
    logoUrl?: string; // Added logoUrl support
    isBlocked: boolean;
    subscriptionStatus: string;
    createdAt: string;
}

export const SuperAdminView = () => {
    const theme = useTheme();
    const [colleges, setColleges] = useState<College[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/superadmin/colleges');
            setColleges(response.data);
        } catch (error) {
            console.error('Failed to fetch colleges', error);
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleBlockToggle = async (id: string, currentStatus: boolean) => {
        try {
            await axios.put(`http://localhost:5000/api/superadmin/colleges/${id}/block`, {
                isBlocked: !currentStatus
            });
            showToast(`College ${currentStatus ? 'Unblocked' : 'Blocked'} successfully`, 'success');
            fetchColleges();
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleEditClick = (college: College) => {
        setEditingCollege(college);
        setOpenForm(true);
    };

    const handleAddClick = () => {
        setEditingCollege(null);
        setOpenForm(true);
    };

    // Derived Stats
    const activeColleges = colleges.filter(c => !c.isBlocked).length;
    const totalRevenue = activeColleges * 499; // Mock revenue calc

    return (
        <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, pb: 8 }}>
            {/* Header Section */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'center' }, 
                mb: 6, gap: 2 
            }}>
                <Box>
                    <Typography variant="overline" fontWeight={700} color="primary" sx={{ letterSpacing: 1.2 }}>
                        SUPER ADMIN CONSOLE
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ 
                        mt: 0.5,
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        ...(theme.palette.mode === 'dark' && {
                            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)'
                        })
                    }}>
                        Platform Overview
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                     <Button 
                        onClick={() => fetchColleges()}
                        variant="outlined"
                        startIcon={<RefreshCcw size={18} className={loading ? "spin" : ""} />}
                        sx={{ borderRadius: 3, px: 3 }}
                    >
                        Refresh
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Plus size={20} />} 
                        onClick={handleAddClick}
                        sx={{ 
                            borderRadius: 3, px: 4, py: 1.2, 
                            boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                            '&:hover': { boxShadow: '0 12px 24px -4px rgba(79, 70, 229, 0.6)' }
                        }}
                    >
                        Onboard College
                    </Button>
                </Box>
            </Box>

            {/* Premium Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {[
                    { label: 'Total Colleges', value: colleges.length, icon: Building, color: '#3b82f6', trend: '+12% this month' },
                    { label: 'Active Subscriptions', value: activeColleges, icon: Zap, color: '#10b981', trend: '98% operational' },
                    { label: 'Platform Users', value: '2.4k', icon: Users, color: '#f59e0b', trend: '+340 this week' },
                    { label: 'Est. Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: Activity, color: '#ec4899', trend: 'Monthly Recurring' }
                ].map((stat, i) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
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

            {/* Styled Table Section */}
            <Paper sx={{ 
                borderRadius: 4, 
                border: '1px solid', borderColor: 'divider', 
                overflow: 'hidden',
                boxShadow: theme.shadows[4] 
            }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <Typography variant="h6" fontWeight={700}>Registered Institutions</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', bgcolor: 'background.paper', px: 2, py: 0.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Search size={16} />
                        <Typography variant="body2">Search...</Typography>
                    </Box>
                </Box>
                
                {loading && <LinearProgress />}
                
                <TableContainer>
                    <Table>
                        <TableHead>
                             <TableRow sx={{ bgcolor: alpha(theme.palette.common.black, 0.02) }}>
                                <TableCell sx={{ py: 2, pl: 4, fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>INSTITUTION</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>CONTACT</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>SUBSCRIPTION</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>STATUS</TableCell>
                                <TableCell align="right" sx={{ pr: 4, fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {colleges.map((college) => (
                                <TableRow key={college._id} hover sx={{ transition: 'all 0.2s' }}>
                                    <TableCell sx={{ py: 3, pl: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar 
                                                src={college.logoUrl} 
                                                variant="rounded" 
                                                sx={{ 
                                                    width: 48, height: 48, 
                                                    bgcolor: 'primary.main', fontWeight: 'bold', fontSize: '1.2rem',
                                                    boxShadow: theme.shadows[2]
                                                }}
                                            >
                                                {college.name[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>{college.name}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                    <Globe size={12} color={theme.palette.text.secondary} />
                                                    <Typography variant="caption" color="text.secondary">resolv-ed.com/c/{college.name.toLowerCase().replace(/\s/g, '-')}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'action.hover' }}>
                                                <Mail size={16} color={theme.palette.text.secondary} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={500}>{college.email}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={college.subscriptionStatus.toUpperCase()} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: college.subscriptionStatus === 'active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                                                color: college.subscriptionStatus === 'active' ? 'success.main' : 'warning.main',
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                px: 1
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ 
                                                width: 8, height: 8, borderRadius: '50%', 
                                                bgcolor: college.isBlocked ? 'error.main' : 'success.main',
                                                boxShadow: `0 0 0 4px ${college.isBlocked ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.success.main, 0.2)}`
                                            }} />
                                            <Typography variant="body2" fontWeight={600} color={college.isBlocked ? 'error.main' : 'text.primary'}>
                                                {college.isBlocked ? 'Suspended' : 'Operational'}
                                            </Typography>
                                         </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 4 }}>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Edit Details">
                                                <IconButton 
                                                    onClick={() => handleEditClick(college)}
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
                                            <Tooltip title={college.isBlocked ? "Unblock Access" : "Block Access"}>
                                                <IconButton 
                                                    onClick={() => handleBlockToggle(college._id, college.isBlocked)}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: college.isBlocked ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                                        color: college.isBlocked ? 'success.main' : 'error.main',
                                                        '&:hover': { 
                                                            bgcolor: college.isBlocked ? 'success.main' : 'error.main', 
                                                            color: 'white' 
                                                        }
                                                    }}
                                                >
                                                    {college.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {colleges.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <Building size={48} color={theme.palette.divider} />
                                            <Typography variant="h6" color="text.secondary">No colleges found</Typography>
                                            <Button variant="outlined" onClick={handleAddClick} sx={{ borderRadius: 2 }}>Onboard your first partner</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <CollegeForm 
                open={openForm} 
                onClose={() => setOpenForm(false)} 
                initialData={editingCollege}
                onSuccess={(updatedCollege) => {
                    if (editingCollege) {
                         setColleges(colleges.map(c => c._id === updatedCollege._id ? updatedCollege : c));
                    } else {
                         setColleges([updatedCollege, ...colleges]);
                    }
                }} 
            />
        </Box>
    );
};
