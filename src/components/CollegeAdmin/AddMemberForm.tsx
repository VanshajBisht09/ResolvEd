import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, Alert, MenuItem, Tabs, Tab,
    Typography, InputAdornment, Chip, Divider
} from '@mui/material';
import axios from 'axios';
import { useToast } from '../common/ToastContext';
import { User, Upload, UserPlus, Info } from 'lucide-react';
import { BulkImport } from './BulkImport'; // Reusing the existing component

interface AddMemberFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ open, onClose, onSuccess }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        // Basic Split for First/Last Name
        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        try {
            const payload = {
                firstName,
                lastName,
                email: formData.email,
                role: formData.role
            };

            const response = await axios.post('http://localhost:5000/api/college/members', payload, {
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ pb: 0 }}>
                Manage Members
            </DialogTitle>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="add member tabs">
                    <Tab label="Quick Add" icon={<UserPlus size={18} />} iconPosition="start" />
                    <Tab label="Bulk Import" icon={<Upload size={18} />} iconPosition="start" />
                </Tabs>
            </Box>

            <DialogContent sx={{ pt: 3 }}>
                {tabIndex === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Add a single member. They will receive a welcome email with login credentials.
                        </Typography>

                        {error && <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>}

                        <TextField 
                            label="Full Name" 
                            name="fullName"
                            value={formData.fullName} 
                            onChange={handleChange} 
                            fullWidth 
                            required 
                            placeholder="e.g. John Doe"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} color="#94a3b8" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <TextField 
                            label="Email Address" 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            fullWidth 
                            required 
                            placeholder="email@university.edu"
                        />
                        
                        <TextField
                            select
                            label="Assign Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            fullWidth
                            helperText={
                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                    {formData.role === 'student' && "Can view courses, submit assignments, and request meetings."}
                                    {formData.role === 'teacher' && "Can manage classes, grade submissions, and approve meetings."}
                                    {formData.role === 'admin' && "Full access to college settings and member management."}
                                </Box>
                            }
                        >
                            <MenuItem value="student">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label="Student" size="small" color="primary" variant="outlined" />
                                    <Typography variant="body2">Learner</Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value="teacher">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label="Faculty" size="small" color="secondary" variant="outlined" />
                                    <Typography variant="body2">Instructor / Staff</Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value="admin">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label="Admin" size="small" color="error" variant="outlined" />
                                    <Typography variant="body2">Administrator</Typography>
                                </Box>
                            </MenuItem>
                        </TextField>

                         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={onClose} color="inherit">Cancel</Button>
                            <Button 
                                onClick={handleSubmit} 
                                variant="contained" 
                                disabled={loading || !formData.fullName || !formData.email}
                                sx={{ 
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                    padding: '8px 24px'
                                }}
                            >
                                {loading ? 'Adding...' : 'Add Member'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {tabIndex === 1 && (
                     <Box>
                        {/* 
                            Reusing the BulkImport Logic but rendering it inline content.
                            Ideally, we refactor BulkImport to be "headless" or just content, 
                            but for now we can wrap it or just invoke the UI logic if we had it exposed.
                            Since BulkImport is a Dialog itself, we shouldn't nest specific Dialogs usually, 
                            but let's see. 
                            
                            WAIT: BulkImport.tsx IS a Dialog. I cannot render a Dialog inside a Dialog Content easily.
                            User Plan said: "Integrate the logic from BulkImport.tsx directly here".
                            
                            Strategy:
                            I will extract the content of BulkImport.tsx into a sub-render function or internal logic here,
                            OR I will modify BulkImport.tsx to be a content component, not a Dialog.
                            
                            Let's check BulkImport.tsx again. It is a <Dialog>.
                            I should refactor BulkImport.tsx to export `BulkImportContent` or similar.
                            
                            For this Turn, I will REWRITE the Bulk Import UI logic directly inside this tab 
                            to make it seamless, as per plan "Integrate logic... directly here".
                         */}
                         <IntegratedBulkImport onSuccess={onSuccess} onClose={onClose} />
                     </Box>
                )}
            </DialogContent>
            {/* Actions are handled inside tabs for better UX flow */}
        </Dialog>
    );
};

// Internal Sub-component for Bulk Import Tab
const IntegratedBulkImport: React.FC<{ onSuccess: (r: any) => void, onClose: () => void }> = ({ onSuccess, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { showToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/api/college/members/bulk`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'x-mock-role': 'admin'
                }
            });
            setResult(response.data.results);
            showToast(`Imported ${response.data.results.added} members.`, 'success');
            if (response.data.results.added > 0) {
                 onSuccess(response.data.results);
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to process file';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
                Upload Excel/CSV with columns: <strong>FirstName, LastName, Email, Role</strong>
            </Typography>
            
            <Box 
                sx={{ 
                    border: '2px dashed', borderColor: 'divider', borderRadius: 2, 
                    p: 4, width: '100%', textAlign: 'center',
                    bgcolor: 'background.default', cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                }}
                component="label"
            >
                <input type="file" accept=".xlsx, .xls, .csv" hidden onChange={handleFileChange} />
                <Upload size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                <Typography variant="h6">{file ? file.name : 'Click to Upload File'}</Typography>
                <Typography variant="caption" color="text.secondary">.xlsx or .csv (Max 5MB)</Typography>
            </Box>

            {loading && <Typography variant="caption" sx={{width: '100%', textAlign: 'center'}}>Uploading...</Typography>}

            {result && (
                <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="success.main">Added: {result.added}</Typography>
                    <Typography variant="subtitle2" color="error.main">Failed: {result.failed}</Typography>
                    <Box sx={{maxHeight: 100, overflowY: 'auto'}}>
                        {result.errors.map((e: string, i: number) => (
                            <Typography key={i} variant="caption" color="error" display="block">{e}</Typography>
                        ))}
                    </Box>
                </Box>
            )}

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleUpload} variant="contained" disabled={loading || !file}>
                    Start Import
                </Button>
            </Box>
        </Box>
    );
}
