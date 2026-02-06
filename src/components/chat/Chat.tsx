import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../MockAuth';
import { Box, Typography, Paper, TextField, Button, Card, useTheme, alpha } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  sender: string;
  text: string;
}

const initialMessages: Message[] = [
    { sender: 'System', text: 'Welcome to the CS Department channel.' },
    { sender: 'Prof. Smith', text: 'Don\'t forget the meeting at 2 PM.' },
    { sender: 'Alice', text: 'Will the minutes be shared?' },
];

const Chat: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(() => {
      const saved = localStorage.getItem('chat_messages');
      return saved ? JSON.parse(saved) : initialMessages;
  });
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chat_messages') {
        const saved = e.newValue;
        if (saved) {
            setMessages(JSON.parse(saved));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveMessages = (newMsgs: Message[]) => {
      setMessages(newMsgs);
      localStorage.setItem('chat_messages', JSON.stringify(newMsgs));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMsg = {
        sender: user?.firstName || 'Me',
        text: newMessage,
      };
      
      const updatedMessages = [...messages, userMsg];
      saveMessages(updatedMessages);
      setNewMessage('');

      // Simulate generic reply
      setTimeout(() => {
          const botMsg = {
              sender: 'Bot',
              text: 'Thanks for your message. This is a demo chat environment.'
          };
          setMessages(prev => {
              const withBot = [...prev, botMsg];
              localStorage.setItem('chat_messages', JSON.stringify(withBot));
              return withBot;
          });
      }, 1000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', boxShadow: theme.shadows[10] }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative' }}>
             <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                 CS
             </Box>
             <Box sx={{ width: 10, height: 10, bgcolor: theme.palette.success.main, borderRadius: '50%', position: 'absolute', bottom: 0, right: 0, border: '2px solid', borderColor: 'primary.main' }} />
        </Box>
        <Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>CS Department Chat</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Online • {user?.fullName}</Typography>
        </Box>
      </Box>
      
      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AnimatePresence>
        {messages.map((msg, index) => {
          const isMe = msg.sender === (user?.firstName || 'Me');
          return (
            <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ 
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
            >
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 1.5, 
                        px: 2,
                        bgcolor: isMe ? 'primary.main' : 'background.paper', 
                        color: isMe ? 'primary.contrastText' : 'text.primary',
                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        boxShadow: isMe ? theme.shadows[4] : theme.shadows[1],
                        position: 'relative'
                    }}
                >
                    <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.text}</Typography>
                </Paper>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.7rem', px: 1 }}>
                    {!isMe && `${msg.sender} • `} 10:42 AM
                </Typography>
            </motion.div>
          );
        })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', position: 'relative', zIndex: 10 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            variant="outlined"
            autoComplete="off"
            sx={{ 
                '& .MuiOutlinedInput-root': { 
                    bgcolor: 'background.default', 
                    borderRadius: 3,
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                },
                '& fieldset': { borderColor: 'transparent' }
            }}
            />
            <Button 
                variant="contained" 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                sx={{ 
                    borderRadius: 3, 
                    minWidth: 50, 
                    width: 50, 
                    height: 40, 
                    p: 0,
                    boxShadow: 'none',
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                }}
            >
                <Typography variant="h5" sx={{ mb: 0.5 }}>➤</Typography>
            </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default Chat;
