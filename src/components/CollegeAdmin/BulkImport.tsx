import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Box, Alert, Typography, LinearProgress, List, ListItem, ListItemText
} from '@mui/material';
import axios from 'axios';
import { useToast } from '../common/ToastContext';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface BulkImportProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (results: any) => void;
}

export const BulkImport: React.FC<BulkImportProps> = ({ open, onClose, onSuccess }) => {
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

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/college/members/bulk', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'x-mock-role': 'admin'
                }
            });
            setResult(response.data.results);
            showToast(`Imported ${response.data.results.added} members.`, 'success');
            if (response.data.results.added > 0) {
                 // Notify success but keep dialog open to show results
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Bulk Import Members</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Upload an Excel (.xlsx) or CSV file with columns: <strong>FirstName, LastName, Email, Role</strong>
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
                        <FileSpreadsheet size={48} color="#888" style={{ marginBottom: 16 }} />
                        <Typography variant="h6">{file ? file.name : 'Click to Upload File (Excel/CSV)'}</Typography>
                        <Typography variant="caption" color="text.secondary">Max 5MB</Typography>
                    </Box>

                    {loading && <Box sx={{ width: '100%' }}><LinearProgress /></Box>}

                    {result && (
                        <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" color="success.main">Successfully Added: {result.added}</Typography>
                            <Typography variant="subtitle2" color="error.main">Failed: {result.failed}</Typography>
                            {result.errors.length > 0 && (
                                <Box sx={{ mt: 1, maxHeight: 100, overflowY: 'auto' }}>
                                    <List dense>
                                        {result.errors.map((err: string, i: number) => (
                                            <ListItem key={i}><ListItemText primary={err} primaryTypographyProps={{ color: 'error', fontSize: '0.75rem' }} /></ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Close</Button>
                <Button onClick={handleUpload} variant="contained" disabled={loading || !file}>
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    );
};
