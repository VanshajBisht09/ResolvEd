import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, Alert 
} from '@mui/material';
import axios from 'axios';
import { useToast } from '../common/ToastContext';

interface CollegeFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (college: any) => void;
    initialData?: any; // For editing
}

export const CollegeForm: React.FC<CollegeFormProps> = ({ open, onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        contactNumber: '',
        adminName: '',
        logoUrl: '',
        website: '',
        description: ''
    });

    // Load initial data for editing
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                address: initialData.address || '',
                contactNumber: initialData.contactNumber || '',
                adminName: '', // Usually don't edit admin name here directly or keep blank
                logoUrl: initialData.logoUrl || '',
                website: initialData.website || '',
                description: initialData.description || ''
            });
        } else {
            // Reset for add mode
            setFormData({
                name: '',
                email: '',
                address: '',
                contactNumber: '',
                adminName: '',
                logoUrl: '',
                website: '',
                description: ''
            });
        }
    }, [initialData, open]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            let response;
            const headers = { 'x-mock-role': 'superadmin' };

            if (initialData) {
                // Edit Mode
                response = await axios.put(`http://localhost:5000/api/superadmin/colleges/${initialData._id}`, formData, { headers });
                showToast('College updated successfully', 'success');
            } else {
                // Create Mode
                response = await axios.post('http://localhost:5000/api/superadmin/colleges', formData, { headers });
                showToast('College onboarded successfully. Email sent.', 'success');
            }
            
            onSuccess(response.data.college || response.data); // PUT might return {message, college}
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save college');
            showToast('Failed to save college', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Edit College Details' : 'Onboard New College'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField 
                        label="College Name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        fullWidth 
                        required 
                    />
                    <TextField 
                        label="College Email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        fullWidth 
                        required 
                        helperText="Admin credentials will be sent here"
                    />
                    <TextField 
                        label="Address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        fullWidth 
                    />
                    <TextField 
                        label="Contact Number" 
                        name="contactNumber" 
                        value={formData.contactNumber} 
                        onChange={handleChange} 
                        fullWidth 
                    />
     <TextField 
                        label="Logo URL (Image Link)" 
                        name="logoUrl" 
                        value={formData.logoUrl} 
                        onChange={handleChange} 
                        fullWidth 
                        placeholder="https://example.com/logo.png"
                    />
                    <TextField 
                        label="Website" 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        fullWidth 
                        placeholder="https://college.edu"
                    />
                    <TextField 
                        label="Description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        fullWidth 
                        multiline
                        rows={3}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update College' : 'Onboard College')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
