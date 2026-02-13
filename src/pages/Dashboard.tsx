import React, { useState, useEffect } from 'react';
import { useUser } from '../components/MockAuth';
import { useData } from '../components/DataContext';
import { StudentDashboard } from '../components/StudentDashboard';
import { FacultyDashboard } from '../components/FacultyDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { Box, Typography, Button, Grid, Skeleton, useTheme, alpha } from '@mui/material';
import { MeetingRequest } from '../types';

import { SuperAdminView } from './SuperAdmin';
import { RequestDetailsModal } from '../components/RequestDetailsModal';

export const DashboardView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
    const theme = useTheme();
    const { user, signOut } = useUser();
    const { requests, addRequest, updateRequestStatus } = useData();
    const role = user?.publicMetadata?.role || 'student';
    
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);

    // Simulate initial data fetch
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200); // 1.2s load for "feel"
        return () => clearTimeout(timer);
    }, []);

    // Mock handlers
    const handleCreateRequest = () => {
        const facultyName = prompt("Faculty Name (e.g. Dr. Sarah Smith):");
        if (!facultyName) return;
        
        const newReq: MeetingRequest = {
            id: Date.now().toString(),
            studentId: user?.id || 'std1',
            studentName: user?.fullName || 'Student',
            facultyId: 'fac1', // mock
            facultyName: facultyName,
            facultyType: 'Teacher',
            issueType: 'Doubt clarification',
            description: 'New request from dashboard',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            scheduledDate: '2026-02-15', 
            scheduledTime: '10:00 AM'
        };
        addRequest(newReq);
    };

    const handleAcceptRequest = (id: string) => {
        updateRequestStatus(id, 'Scheduled');
    };

    const handleBulkAccept = (ids: string[]) => {
        ids.forEach(id => updateRequestStatus(id, 'Scheduled'));
    };

    const handleRequestClick = (req: MeetingRequest) => {
        setSelectedRequest(req);
    };

    const handleReschedule = (requestId: string) => {
        alert("Rescheduling feature coming soon! 🗓️");
    };

    if (loading) {
        return (
            <Box>
                {/* Header Skeleton */}
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={200} height={40} animation="wave" />
                    <Skeleton variant="text" width={300} height={24} animation="wave" sx={{ opacity: 0.6 }} />
                </Box>

                {/* Stats Cards Skeleton */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={i}>
                            <Skeleton 
                                variant="rectangular" 
                                height={140} 
                                animation="wave"
                                sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content Skeleton */}
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Skeleton 
                            variant="rectangular" 
                            height={400} 
                            animation="wave"
                            sx={{ borderRadius: 4, mb: 3 }} 
                        />
                        <Skeleton 
                            variant="rectangular" 
                            height={200} 
                            animation="wave"
                            sx={{ borderRadius: 4 }} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Skeleton 
                            variant="rectangular" 
                            height={600} 
                            animation="wave"
                            sx={{ borderRadius: 4 }} 
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (role === 'admin') {
        return (
            <AdminDashboard 
                user={{...user, id: user.id || 'admin', name: user.fullName || 'Admin', email: '', role: 'admin'}} 
                allRequests={requests} 
                onLogout={signOut} 
                onNavigate={onNavigate}
            />
        );
    }

    if (role === 'superadmin') {
        return <SuperAdminView />;
    }

    if (role === 'teacher' || role === 'faculty') {
        const myRequests = requests; 
        return (
            <>
                <FacultyDashboard 
                    user={{...user, id: user.id || 'fac', name: user.fullName || 'Faculty', email: '', role: 'faculty', department: 'CS'}}
                    requests={myRequests}
                    onRequestClick={handleRequestClick}
                    onAcceptRequest={handleAcceptRequest}
                    onBulkAccept={handleBulkAccept}
                    onLogout={signOut}
                />
                <RequestDetailsModal 
                    isOpen={!!selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    request={selectedRequest}
                    viewMode="faculty"
                    onReschedule={handleReschedule}
                />
            </>
        );
    }

    const myRequests = requests.filter(r => r.studentId === user?.id || r.studentId === 'std1');
    const displayRequests = myRequests.length > 0 ? myRequests : requests; 

    return (
        <>
            <StudentDashboard 
                user={{...user, id: user.id || 'std', name: user.fullName || 'Student', email: '', role: 'student', department: 'CS'}}
                requests={displayRequests}
                facultyList={useData().faculty}
                onAddRequest={addRequest}
                onRequestClick={handleRequestClick}
                onNavigate={onNavigate}
                onLogout={signOut}
            />
            <RequestDetailsModal 
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
                viewMode="student"
            />
        </>
    );
};
