import React, { useEffect, useState } from 'react';
import { Dialog, Box, Typography, Avatar, IconButton, Button, alpha, useTheme } from '@mui/material';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallModalProps {
    open: boolean;
    onClose: () => void;
    studentName: string;
    studentAvatar?: string;
    type: 'audio' | 'video';
}

export const CallModal: React.FC<CallModalProps> = ({ open, onClose, studentName, studentAvatar, type }) => {
    const theme = useTheme();
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (open) {
            setDuration(0);
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [open]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: 'grey.900',
                    backgroundImage: 'none', // Remove default gradient if any
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }
            }}
        >
            {/* Background Blob Animation */}
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.3, zIndex: 0 }}>
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%',
                        background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        zIndex: 0
                    }}
                />
            </Box>

            <Box sx={{ zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Avatar 
                    src={studentAvatar} 
                    sx={{ 
                        width: 120, height: 120, 
                        bgcolor: 'primary.main',
                        fontSize: '3rem',
                        boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.5)}`,
                        border: '4px solid',
                        borderColor: 'primary.main'
                    }}
                >
                    {studentName.charAt(0)}
                </Avatar>
                
                <Box>
                    <Typography variant="h4" fontWeight="700" color="white" sx={{ mb: 1 }}>{studentName}</Typography>
                    <Typography variant="body1" color="grey.400" sx={{ letterSpacing: 1 }}>
                        {duration > 0 ? formatTime(duration) : 'Calling...'}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                    <IconButton 
                        size="large"
                        onClick={() => setIsMuted(!isMuted)}
                        sx={{ 
                            bgcolor: isMuted ? 'white' : alpha('white', 0.1), 
                            color: isMuted ? 'grey.900' : 'white',
                            p: 2,
                            '&:hover': { bgcolor: isMuted ? 'grey.200' : alpha('white', 0.2) } 
                        }}
                    >
                        {isMuted ? <MicOff /> : <Mic />}
                    </IconButton>
                    
                    {type === 'video' && (
                        <IconButton 
                            size="large"
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            sx={{ 
                                bgcolor: isVideoOff ? 'white' : alpha('white', 0.1), 
                                color: isVideoOff ? 'grey.900' : 'white',
                                p: 2,
                                '&:hover': { bgcolor: isVideoOff ? 'grey.200' : alpha('white', 0.2) } 
                            }}
                        >
                            {isVideoOff ? <VideoOff /> : <Video />}
                        </IconButton>
                    )}

                    <IconButton 
                        size="large"
                        onClick={onClose}
                        sx={{ 
                            bgcolor: 'error.main', 
                            color: 'white',
                            p: 2,
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                            '&:hover': { bgcolor: 'error.dark' } 
                        }}
                    >
                        <PhoneOff />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
};
