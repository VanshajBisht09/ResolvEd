import React, { useState, useRef, useEffect } from 'react';
import { 
    Box, Typography, Chip, Button, IconButton, TextField, 
    InputAdornment, Paper, useTheme, alpha, Tooltip, Dialog,
    DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, DialogActions 
} from '@mui/material';
import { 
    CheckCircle, Clock, Activity, AlertCircle, FileText, 
    MoreHorizontal, MessageSquare, Send, Trash2, Edit 
} from 'lucide-react';
import { 
    doc, updateDoc, arrayUnion, deleteDoc, Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useUser } from '../MockAuth';
import { useToast } from '../common/ToastContext';

// --- Types (Duplicated locally or import from shared types later) ---
interface Comment {
    id: number;
    sender: string;
    role: 'student' | 'admin' | 'faculty';
    text: string;
    timestamp: string;
}

export interface Complaint {
    id: string;
    type: string;
    description: string;
    status: 'pending' | 'resolved' | 'rejected' | 'in_progress';
    createdAt: string;
    priority: 'High' | 'Medium' | 'Low';
    comments: Comment[];
}

interface ComplaintDetailProps {
    complaint: Complaint | null;
    onDeselect: () => void; // Mobile mainly
}

export const ComplaintDetail = ({ complaint, onDeselect }: ComplaintDetailProps) => {
    const theme = useTheme();
    const { user } = useUser();
    const { showToast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [commentText, setCommentText] = useState('');
    
    // Edit State
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editDescription, setEditDescription] = useState('');
    const [editType, setEditType] = useState('');

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [complaint?.comments]);

    if (!complaint) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                <FileText size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>Select a ticket to view details</Typography>
            </Box>
        );
    }

    const handleSendComment = async () => {
        if (!commentText.trim()) return;

        const newComment: Comment = {
            id: Date.now(),
            sender: user?.publicMetadata?.name || 'User',
            role: user?.publicMetadata?.role as any || 'student',
            text: commentText,
            timestamp: new Date().toISOString()
        };

        try {
            const ticketRef = doc(db, "complaints", complaint.id);
            await updateDoc(ticketRef, {
                comments: arrayUnion(newComment)
            });
            setCommentText('');
        } catch (e) {
            console.error("Error adding comment: ", e);
            showToast('Failed to send message', 'error');
        }
    };

    const handleStatusChange = async (newStatus: Complaint['status']) => {
        try {
             const ticketRef = doc(db, "complaints", complaint.id);
             await updateDoc(ticketRef, { status: newStatus });
             showToast(`Ticket marked as ${newStatus}`, 'success');
        } catch (e) {
            console.error("Error updating status: ", e);
            showToast('Failed to update status', 'error');
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "complaints", complaint.id));
            showToast('Ticket deleted successfully', 'success');
            if (onDeselect) onDeselect(); // Clear selection
        } catch (e) {
            console.error("Error deleting ticket: ", e);
            showToast('Failed to delete ticket', 'error');
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    // ... (rest of code)

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={isDeleteDialogOpen} 
                onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 1, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <AlertCircle size={24} /> Delete Ticket?
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this ticket? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting} sx={{ borderRadius: 1 }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleConfirmDelete} 
                        disabled={isDeleting}
                        sx={{ borderRadius: 1, fontWeight: 700 }}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                    </Button>
                </DialogActions>
            </Dialog>

    const openEditDialog = () => {
        setEditDescription(complaint.description);
        setEditType(complaint.type);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            const ticketRef = doc(db, "complaints", complaint.id);
            await updateDoc(ticketRef, { 
                description: editDescription,
                type: editType
            });
            showToast('Ticket updated successfully', 'success');
            setIsEditDialogOpen(false);
        } catch (e) {
            console.error("Error updating ticket: ", e);
            showToast('Failed to update ticket', 'error');
        }
    };

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

    const isOwner = true; // Simplified for now, in real app check User ID
    const isPending = complaint.status === 'pending';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h5" fontWeight={700}>#{complaint.id.slice(0, 6)}</Typography>
                            {getStatusChip(complaint.status)}
                            <Chip label={complaint.priority} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
                            {complaint.description}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isOwner && isPending && (
                            <>
                                <Tooltip title="Edit Ticket">
                                    <IconButton size="small" onClick={openEditDialog}>
                                        <Edit size={18} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Ticket">
                                    <IconButton size="small" color="error" onClick={handleDeleteClick}>
                                        <Trash2 size={18} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {user?.publicMetadata?.role !== 'student' && complaint.status !== 'resolved' && (
                            <Button size="small" variant="outlined" color="success" onClick={() => handleStatusChange('resolved')}>
                                Resolve
                            </Button>
                        )}
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FileText size={14} /> {complaint.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} /> {new Date(complaint.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            {/* Chat Area */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(!complaint.comments || complaint.comments.length === 0) ? (
                        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <Box sx={{ bgcolor: 'action.hover', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                            <MessageSquare size={24} />
                        </Box>
                        <Typography variant="body2">No comments yet.</Typography>
                    </Box>
                ) : (
                    complaint.comments.map((comment) => (
                        <Box 
                            key={comment.id} 
                            sx={{ 
                                alignSelf: comment.sender === (user?.publicMetadata?.name || 'User') ? 'flex-end' : 'flex-start',
                                maxWidth: '75%'
                            }}
                        >
                            <Paper sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                bgcolor: comment.sender === (user?.publicMetadata?.name || 'User') ? 'primary.main' : 'background.paper',
                                color: comment.sender === (user?.publicMetadata?.name || 'User') ? 'primary.contrastText' : 'text.primary',
                                boxShadow: theme.shadows[1]
                            }}>
                                <Typography variant="caption" sx={{ opacity: 0.8, mb: 0.5, display: 'block' }}>
                                    {comment.sender} • {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                                <Typography variant="body2">{comment.text}</Typography>
                            </Paper>
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    placeholder={complaint.status === 'resolved' ? "Ticket is resolved." : "Type a reply..."}
                    disabled={complaint.status === 'resolved'}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendComment();
                        }
                    }}
                    InputProps={{
                        sx: { borderRadius: 1 },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton color="primary" onClick={handleSendComment} disabled={!commentText.trim() || complaint.status === 'resolved'}>
                                    <Send size={18} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Edit Ticket</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select 
                                value={editType} 
                                label="Category" 
                                onChange={(e) => setEditType(e.target.value)}
                            >
                                <MenuItem value="Cleanliness">Cleanliness & Hygiene</MenuItem>
                                <MenuItem value="Academic">Academic Issues</MenuItem>
                                <MenuItem value="Facility">Infrastructure & Facilities</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField 
                            fullWidth multiline rows={3} label="Description"
                            value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSubmit}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={isDeleteDialogOpen} 
                onClose={() => setIsDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 1, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <AlertCircle size={24} /> Delete Ticket?
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this ticket? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} sx={{ borderRadius: 1 }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleConfirmDelete} 
                        sx={{ borderRadius: 1, fontWeight: 700 }}
                    >
                        Delete Permanently
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
