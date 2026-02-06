import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Box, 
    FormControl, InputLabel, Select, MenuItem, TextField, Button,
    SelectChangeEvent
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useToast } from '../common/ToastContext';

interface CreateComplaintDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newId: string) => void;
}

export const CreateComplaintDialog = ({ open, onClose, onSuccess }: CreateComplaintDialogProps) => {
    const { showToast } = useToast();
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!type || !description) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const newItem = {
                type,
                description,
                priority,
                status: 'pending',
                createdAt: new Date().toISOString(),
                comments: []
            };

            const docRef = await addDoc(collection(db, "complaints"), newItem);
            showToast('Ticket created successfully!', 'success');
            onSuccess(docRef.id);
            onClose(); // Close the modal
            
            // Reset form
            setType('');
            setDescription('');
            setPriority('Medium');
        } catch (e) {
            console.error("Error adding document: ", e);
            showToast('Failed to create ticket. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 1, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 800 }}>Create New Ticket</DialogTitle>
            <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select 
                            value={type} 
                            label="Category" 
                            onChange={(e: SelectChangeEvent) => setType(e.target.value)}
                            sx={{ borderRadius: 1 }}
                        >
                            <MenuItem value="Cleanliness">Cleanliness & Hygiene</MenuItem>
                            <MenuItem value="Academic">Academic Issues</MenuItem>
                            <MenuItem value="Facility">Infrastructure & Facilities</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select 
                            value={priority} 
                            label="Priority" 
                            onChange={(e: SelectChangeEvent) => setPriority(e.target.value)}
                            sx={{ borderRadius: 1 }}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField 
                        fullWidth multiline rows={4} 
                        label="Description" 
                        placeholder="Describe the issue... (e.g. detailed location, nature of problem)" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                    </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ borderRadius: 1 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    sx={{ borderRadius: 1, fontWeight: 700 }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
