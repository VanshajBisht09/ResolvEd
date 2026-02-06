import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, Card } from '@mui/material';
import { Plus } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { useUser } from '../MockAuth';

// Components
import { ComplaintList } from '../complaints/ComplaintList';
import { ComplaintDetail, Complaint } from '../complaints/ComplaintDetail';
import { CreateComplaintDialog } from '../complaints/CreateComplaintDialog';

export const ComplaintsView = () => {
    const { user } = useUser();
    const theme = useTheme();
    
    // State
    const [complaintsList, setComplaintsList] = useState<Complaint[]>([]);
    const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filter State
    const [activeTab, setActiveTab] = useState(0); 
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // --- Firestore Real-time Listener ---
    useEffect(() => {
        const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedComplaints: Complaint[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Complaint));
            
            setComplaintsList(fetchedComplaints);
            setIsLoading(false);

            // Auto-select logic
            if (!selectedComplaintId && fetchedComplaints.length > 0) {
                // Optional: Select first item if nothing selected
            }
            // Check if selected item was deleted
            if (selectedComplaintId && !fetchedComplaints.find(c => c.id === selectedComplaintId)) {
                setSelectedComplaintId(null);
            }
        });

        return () => unsubscribe();
    }, [selectedComplaintId]);

    const selectedComplaint = complaintsList.find(c => c.id === selectedComplaintId) || null;

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Support Inbox (Firebase)</Typography>
                    <Typography variant="body2" color="text.secondary">Real-time issues management.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<Plus size={18} />} 
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{ borderRadius: 1, fontWeight: 600, boxShadow: theme.shadows[4] }}
                >
                    New Ticket
                </Button>
            </Box>

            {/* Master-Detail Container */}
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', bgcolor: 'background.paper' }}>
                
                <ComplaintList 
                    complaints={complaintsList}
                    selectedId={selectedComplaintId}
                    onSelect={setSelectedComplaintId}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
                     <ComplaintDetail 
                        complaint={selectedComplaint} 
                        onDeselect={() => setSelectedComplaintId(null)}
                    />
                </Box>
            </Box>

            <CreateComplaintDialog 
                open={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newId) => setSelectedComplaintId(newId)}
            />
        </Box>
    );
};
