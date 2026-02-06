import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton, Avatar, useTheme, alpha, Badge, styled } from '@mui/material';
import { Send, Paperclip, Phone, Video, FileText, Smile } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatSession, ChatMessage } from '../../types';
import { CallModal } from './CallModal';

// Styled Badge for pulsing effect
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

interface ChatWindowProps {
  session: ChatSession | null;
  onSendMessage: (text: string, attachment?: ChatMessage['attachment']) => void;
  currentUser: { id: string; name: string };
}

// Emoji List (Simple set)
const EMOJIS = ['👍', '👎', '❤️', '🔥', '🎉', '😊', '😂', '😮', '😢', '😡', '👀', '✅', '🚀', '💯'];

export const ChatWindow: React.FC<ChatWindowProps> = ({ session, onSendMessage, currentUser }) => {
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [callState, setCallState] = useState<{ open: boolean; type: 'audio' | 'video' }>({ open: false, type: 'audio' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages, isTyping]);

  const handleSend = () => {
      if (newMessage.trim()) {
          onSendMessage(newMessage);
          setNewMessage('');
          
          // Simulate reply typing
          setTimeout(() => setIsTyping(true), 1000);
          setTimeout(() => setIsTyping(false), 3500);
      }
  };

  const addEmoji = (emoji: string) => {
      setNewMessage(prev => prev + emoji);
      setShowEmoji(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          // Simulate upload
          const isImage = file.type.startsWith('image/');
          const attachment: ChatMessage['attachment'] = {
              name: file.name,
              type: isImage ? 'image' : 'file',
              url: isImage ? URL.createObjectURL(file) : undefined,
              size: `${(file.size / 1024).toFixed(1)} KB`
          };
          onSendMessage(isImage ? 'Sent an image' : 'Sent a file', attachment);

           // Simulate reply typing for attachment too
          setTimeout(() => setIsTyping(true), 1500);
          setTimeout(() => setIsTyping(false), 4000);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!session) {
      return (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.05), mb: 1 }}>
                <Send size={40} color={theme.palette.primary.main} style={{ opacity: 0.8 }} />
              </Paper>
              <Typography variant="h6" fontWeight="600" color="text.primary">Your Messages</Typography>
              <Typography variant="body2" color="text.secondary">Select a conversation to start chatting</Typography>
          </Box>
      );
  }

  const formatDateLabel = (dateString: string) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderBottom: 1, 
          borderColor: 'divider', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          zIndex: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StyledBadge 
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar src={session.contactAvatar} alt={session.contactName} sx={{ width: 40, height: 40 }}>{session.contactName.charAt(0)}</Avatar>
            </StyledBadge>
            <Box>
                <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>{session.contactName}</Typography>
                <Typography variant="caption" color="success.main" fontWeight="600">Online</Typography>
            </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setCallState({ open: true, type: 'audio' })}><Phone size={18} /></IconButton>
            <IconButton size="small" onClick={() => setCallState({ open: true, type: 'video' })}><Video size={18} /></IconButton>
        </Box>
      </Box>

      {/* Call Modal */}
      {session && (
        <CallModal 
            open={callState.open} 
            onClose={() => setCallState({ ...callState, open: false })} 
            studentName={session.contactName}
            studentAvatar={session.contactAvatar}
            type={callState.type}
        />
      )}

      {/* Messages */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`, backgroundSize: 'cover' }}>
          <AnimatePresence>
            {session.messages.map((msg, index) => {
                const isMe = msg.senderId === currentUser.id;
                const showDate = index === 0 || formatDateLabel(session.messages[index - 1].timestamp) !== formatDateLabel(msg.timestamp);
                
                // Grouping Logic
                const prevIsSame = index > 0 && session.messages[index - 1].senderId === msg.senderId;
                const nextIsSame = index < session.messages.length - 1 && session.messages[index + 1].senderId === msg.senderId;
                
                return (
                    <React.Fragment key={msg.id}>
                        {showDate && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, opacity: 0.8 }}>
                                <Paper elevation={0} sx={{ px: 1.5, py: 0.5, bgcolor: alpha(theme.palette.divider, 0.5), borderRadius: 4 }}>
                                    <Typography variant="caption" fontWeight="600" color="text.secondary">
                                        {formatDateLabel(msg.timestamp)}
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            whileHover={{ scale: 1.01 }}
                            style={{ 
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '75%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMe ? 'flex-end' : 'flex-start',
                                marginTop: prevIsSame ? 2 : 8
                            }}
                        >
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 1.5, 
                                    px: 2,
                                    bgcolor: isMe ? 'primary.main' : 'background.paper', 
                                    color: isMe ? 'primary.contrastText' : 'text.primary',
                                    borderRadius: isMe 
                                        ? `${prevIsSame ? 4 : 20}px ${prevIsSame ? 4 : 20}px ${nextIsSame ? 4 : 20}px 20px` 
                                        : `${prevIsSame ? 4 : 20}px ${prevIsSame ? 4 : 20}px 20px ${nextIsSame ? 4 : 20}px`,
                                    boxShadow: isMe ? '0 4px 12px rgba(99, 102, 241, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    transition: 'box-shadow 0.2s ease-in-out'
                                }}
                            >
                                {msg.attachment ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {msg.attachment.type === 'image' && msg.attachment.url ? (
                                            <Box 
                                                component="img" 
                                                src={msg.attachment.url} 
                                                alt="attachment" 
                                                sx={{ 
                                                    maxWidth: '100%', 
                                                    borderRadius: 2, 
                                                    maxHeight: 200, 
                                                    objectFit: 'cover' 
                                                }} 
                                            />
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, bgcolor: alpha(theme.palette.common.white, 0.1), borderRadius: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: alpha(theme.palette.common.white, 0.2), borderRadius: 1 }}>
                                                    <FileText size={20} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600">{msg.attachment.name}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>{msg.attachment.size}</Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        {msg.text && <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.text}</Typography>}
                                    </Box>
                                ) : (
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.text}</Typography>
                                )}
                            </Paper>
                            {!nextIsSame && (
                                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.7rem', px: 1, opacity: 0.7 }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            )}
                        </motion.div>
                    </React.Fragment>
                );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    style={{ 
                        alignSelf: 'flex-start',
                        marginTop: 8
                    }}
                >
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 2,
                            px: 2.5,
                            bgcolor: 'background.paper',
                            borderRadius: '4px 20px 20px 20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center'
                        }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.text.secondary
                                }}
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </Paper>
                </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Paper 
            elevation={3}
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1, 
                pl: 2, 
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
            }}
          >
                <IconButton 
                     size="small" 
                     sx={{ color: showEmoji ? 'primary.main' : 'text.secondary', bgcolor: showEmoji ? alpha(theme.palette.primary.main, 0.1) : 'transparent' }}
                     onClick={() => setShowEmoji(!showEmoji)}
                 >
                    <Smile size={20} />
                </IconButton>
                <Box sx={{ position: 'relative' }}>
                    {showEmoji && (
                        <Paper 
                            sx={{ 
                                position: 'absolute', bottom: 50, left: -40, 
                                p: 1, 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(7, 1fr)', 
                                gap: 0.5,
                                zIndex: 20,
                                boxShadow: theme.shadows[4]
                            }}
                        >
                            {EMOJIS.map(emoji => (
                                <IconButton key={emoji} size="small" onClick={() => addEmoji(emoji)}>
                                    <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
                                </IconButton>
                            ))}
                        </Paper>
                    )}
                </Box>

               <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }} 
                    onChange={handleFileSelect}
               />
               <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary', bgcolor: alpha(theme.palette.grey[500], 0.1) }}
                    onClick={() => fileInputRef.current?.click()}
                >
                   <Paperclip size={18} />
               </IconButton>
               <TextField 
                   fullWidth
                   placeholder="Type a message..."
                   variant="standard"
                   InputProps={{ disableUnderline: true }}
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyDown={handleKeyDown}
                   multiline
                   maxRows={3}
                   sx={{ py: 1 }}
               />
               <Button 
                   variant="contained" 
                   sx={{ 
                       minWidth: 44, width: 44, height: 44, 
                       borderRadius: '50%', p: 0, 
                       boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                       transition: 'transform 0.2s',
                       '&:hover': { transform: 'scale(1.05)' }
                   }}
                   onClick={handleSend}
                   disabled={!newMessage.trim()}
               >
                   <Send size={20} />
               </Button>
          </Paper>
      </Box>
    </Box>
  );
};
