import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, Alert, MenuItem 
} from '@mui/material';
import axios from 'axios';
import { useToast } from '../common/ToastContext';

interface AddMemberFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'student'
    });
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
            const response = await axios.post('http://localhost:5000/api/college/members', formData, {
                headers: {
                    'x-mock-role': 'admin'
                }
            });
            showToast('Member added successfully. Email sent.', 'success');
            onSuccess(response.data.user);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to add member');
            showToast('Failed to add member', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField 
                        label="First Name" name="firstName" 
                        value={formData.firstName} onChange={handleChange} fullWidth required 
                    />
                    <TextField 
                        label="Last Name" name="lastName" 
                        value={formData.lastName} onChange={handleChange} fullWidth required 
                    />
                    <TextField 
                        label="Email" name="email" type="email"
                        value={formData.email} onChange={handleChange} fullWidth required 
                    />
                    <TextField
                        select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="teacher">Faculty</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Member'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
