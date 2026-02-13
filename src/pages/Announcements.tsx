import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useUser } from '../components/MockAuth';
import { Plus, Pin, MoreHorizontal, User } from 'lucide-react';

const MOCK_ANNOUNCEMENTS = [
    { id: 1, title: 'Exam Schedule Update', content: 'The final dates for the Spring semester exams have been pushed back by one week due to the upcoming festival. Please check the student portal for the revised timetable.', authorId: 'Admin', createdAt: new Date().toISOString() },
    { id: 2, title: 'Guest Lecture: AI in Healthcare', content: 'Join us for an insightful session with Dr. Roberts from City Hospital on how AI is revolutionizing diagnostics. Venue: Auditorium, 2 PM tomorrow.', authorId: 'Dean', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 3, title: 'Library Renovation Alert', content: 'The main reading hall will be closed for renovation from 10th to 15th Feb. The extension block will remain open 24/7 during this period to accommodate students.', authorId: 'Librarian', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, title: 'Sports Day Registrations', content: 'Registrations for the Annual Sports Meet are now open! Sign up for Cricket, Football, and Athletics at the Gymkhana office by Friday.', authorId: 'Sports Dept', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 5, title: 'Lost & Found: Blue Backpack', content: 'A blue backpack was found in the cafeteria yesterday. Please claim it from the security office with proof of ownership.', authorId: 'Security', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 6, title: 'Hackathon 2026', content: 'Get ready for the biggest coding event of the year! 24-hour hackathon starting next Saturday. Great prizes to be won!', authorId: 'Tech Club', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export const AnnouncementsView = () => {
    const { user } = useUser();
    const [announcements, setAnnouncements] = useState<any[]>(MOCK_ANNOUNCEMENTS);
    const [open, setOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    const handlePost = () => {
        if (!newPost.title || !newPost.content) return;
        
        const post = {
            id: Date.now(),
            title: newPost.title,
            content: newPost.content,
            authorId: user?.firstName || 'User',
            createdAt: new Date().toISOString()
        };

        setAnnouncements([post, ...announcements]);
        setOpen(false);
        setNewPost({ title: '', content: '' });
    };

    return (
        <Box sx={{ pb: 4, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Box>
                     <Typography variant="h4" fontWeight={800} gutterBottom>Announcements</Typography>
                     <Typography variant="body1" color="text.secondary">Stay updated with the latest news from campus.</Typography>
                </Box>
                {(user?.publicMetadata?.role === 'teacher' || user?.publicMetadata?.role === 'admin') && (
                    <Button 
                        variant="contained" 
                        onClick={() => setOpen(true)} 
                        disableElevation 
                        startIcon={<Plus size={18} />}
                        sx={{ borderRadius: 1, px: 3, py: 1.2, fontWeight: 600 }}
                    >
                        New Post
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Main Feed Column */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Grid container spacing={3}>
                        {/* Mock Pinned Post */}
                        <Grid size={{ xs: 12 }}>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Card sx={{ 
                                    borderRadius: 1, 
                                    border: '1px solid', 
                                    borderColor: 'primary.main', 
                                    bgcolor: 'rgba(79, 70, 229, 0.02)',
                                    position: 'relative',
                                    overflow: 'visible'
                                }}>
                                     <Box sx={{ 
                                         position: 'absolute', top: -12, left: 24, 
                                         bgcolor: 'primary.main', color: 'white', 
                                         px: 1.5, py: 0.5, borderRadius: 10,
                                         display: 'flex', alignItems: 'center', gap: 0.5,
                                         fontSize: '0.75rem', fontWeight: 700,
                                         boxShadow: 2
                                     }}>
                                         <Pin size={12} fill="currentColor" /> Pinned
                                     </Box>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 1 }}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>A</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}>Admin Office</Typography>
                                                    <Typography variant="caption" color="text.secondary">Posted on Feb 1, 2026</Typography>
                                                </Box>
                                            </Box>
                                            <IconButton size="small"><MoreHorizontal size={20} /></IconButton>
                                        </Box>
                                        <Typography variant="h5" fontWeight={800} gutterBottom>Spring Semester Registration Guidelines</Typography>
                                        <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                                            Registration for the Spring 2026 semester will begin on February 15th. 
                                            Please ensure all outstanding dues are cleared before this date. 
                                            Visit the student portal for the step-by-step guide on how to select your electives.
                                        </Typography>
                                        <Button variant="outlined" size="small" sx={{ borderRadius: 1 }}>Read Guidelines</Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        {/* Regular Posts List */}
                        {announcements.map((item, i) => (
                            <Grid size={{ xs: 12 }} key={i}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Card sx={{ borderRadius: 4, '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.200', color: 'grey.700' }}>
                                                        <User size={20} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight={700}>Faculty (ID: {item.authorId})</Typography>
                                                        <Typography variant="caption" color="text.secondary">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</Typography>
                                                    </Box>
                                                </Box>
                                                <Chip label="Update" size="small" sx={{ bgcolor: 'grey.100', fontWeight: 600, fontSize: '0.7rem' }} />
                                            </Box>
                                            
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                                {item.content}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                        
                        {announcements.length === 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                                    <Box sx={{ display: 'inline-flex', p: 3, bgcolor: 'grey.100', borderRadius: '50%', mb: 2 }}>
                                        <Pin size={32} color="gray" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom>No announcements yet</Typography>
                                    <Typography variant="body2">Check back later for updates.</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {/* Sidebar Column */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, px: 1 }}>Trending Topics</Typography>
                        <Card sx={{ borderRadius: 4, mb: 3 }}>
                            <CardContent sx={{ p: 0 }}>
                                {['#SpringExams', '#CampusFest', '#LibraryHours', '#PlacementDrive'].map((topic, i) => (
                                    <Box key={i} sx={{ 
                                        p: 2, px: 3, 
                                        borderBottom: i < 3 ? '1px solid' : 'none', 
                                        borderColor: 'divider',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}>
                                        <Typography variant="subtitle2" fontWeight={700} color="primary.main">{topic}</Typography>
                                        <Typography variant="caption" color="text.secondary">{10 + i * 5} posts this week</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, mt: 4, px: 1 }}>Categories</Typography>
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {['Academic', 'Events', 'Sports', 'Admin', 'Clubs', 'Placement'].map((cat) => (
                                <Chip 
                                    key={cat} label={cat} 
                                    clickable 
                                    sx={{ fontWeight: 600, borderRadius: 2 }} 
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Post Dialog */}
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle fontWeight={800} sx={{ pb: 1 }}>Create Announcement</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Share important news with the entire campus.</Typography>
                    <TextField 
                        autoFocus label="Title" fullWidth variant="outlined" 
                        value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        sx={{ mb: 3 }}
                    />
                    <TextField 
                        label="Content" fullWidth multiline rows={6} variant="outlined" 
                        value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        placeholder="Write your announcement here..."
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2, color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handlePost} variant="contained" disableElevation sx={{ borderRadius: 2, px: 3 }}>Post Announcement</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
