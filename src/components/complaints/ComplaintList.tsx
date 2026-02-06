import React from 'react';
import { 
    Box, Typography, TextField, InputAdornment, Tabs, Tab, 
    useTheme, alpha, Chip, Skeleton 
} from '@mui/material';
import { Search, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Complaint } from './ComplaintDetail'; // Import type

interface ComplaintListProps {
    complaints: Complaint[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isLoading: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    activeTab: number;
    setActiveTab: (t: number) => void;
}

export const ComplaintList = ({ 
    complaints, selectedId, onSelect, isLoading,
    searchQuery, setSearchQuery, activeTab, setActiveTab 
}: ComplaintListProps) => {
    const theme = useTheme();

    const getStatusChip = (status: string) => {
        const config: any = {
            resolved: { color: 'success', icon: <CheckCircle size={14} />, label: 'Resolved' },
            pending: { color: 'warning', icon: <Clock size={14} />, label: 'Pending' },
            in_progress: { color: 'info', icon: <Activity size={14} />, label: 'In Progress' },
            rejected: { color: 'error', icon: <AlertCircle size={14} />, label: 'Rejected' },
        };
        const s = config[status] || config.pending;
        return <Chip icon={s.icon} label={s.label} color={s.color} size="small" variant="filled" sx={{ borderRadius: 1, fontWeight: 700 }} />;
    };
    
    const priorityColors: any = { High: 'error.main', Medium: 'warning.main', Low: 'success.main' };

    // Filter Logic
    const getFilteredComplaints = () => {
        let filtered = complaints;
        if (activeTab === 1) filtered = filtered.filter(c => c.status === 'pending' || c.status === 'in_progress');
        if (activeTab === 2) filtered = filtered.filter(c => c.status === 'resolved');
        
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c => 
                c.description.toLowerCase().includes(q) || 
                c.type.toLowerCase().includes(q)
            );
        }
        return filtered;
    };

    const filteredList = getFilteredComplaints();

    return (
        <Box sx={{ width: 380, borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            
            {/* Filters */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
                        sx: { borderRadius: 1 }
                    }}
                    sx={{ mb: 2 }}
                />
                <Tabs 
                    value={activeTab} 
                    onChange={(e, v) => setActiveTab(v)} 
                    variant="fullWidth"
                    sx={{ minHeight: 40, '& .MuiTab-root': { py: 1, minHeight: 40, fontWeight: 600, borderRadius: 1 } }}
                >
                    <Tab label="All" />
                    <Tab label="Open" />
                    <Tab label="Closed" />
                </Tabs>
            </Box>

            {/* List Content */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                
                {isLoading ? (
                    // Skeleton Loading State
                    [1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Skeleton width={60} height={20} />
                                <Skeleton width={80} height={20} />
                            </Box>
                            <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
                            <Skeleton variant="text" width="60%" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Skeleton width={80} height={24} />
                                <Skeleton width={80} height={24} />
                            </Box>
                        </Box>
                    ))
                ) : filteredList.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                        <Typography variant="body2">No tickets found.</Typography>
                    </Box>
                ) : (
                    filteredList.map((ticket) => (
                        <Box 
                            key={ticket.id}
                            onClick={() => onSelect(ticket.id)}
                            sx={{ 
                                p: 2, 
                                cursor: 'pointer',
                                borderBottom: '1px solid', 
                                borderColor: 'divider',
                                bgcolor: selectedId === ticket.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                borderLeft: selectedId === ticket.id ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                                '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.05) },
                                transition: 'all 0.1s'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight={700} color={priorityColors[ticket.priority]}>
                                    {ticket.priority}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                                {ticket.type}: {ticket.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '60%' }}>
                                    #{ticket.id.slice(0, 6)}... • {ticket.comments?.length || 0} comments
                                </Typography>
                                {getStatusChip(ticket.status)}
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};
