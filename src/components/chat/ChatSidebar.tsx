
import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, TextField, InputAdornment, Paper, Badge, useTheme, alpha } from '@mui/material';
import { Search } from 'lucide-react';
import { ChatSession } from '../../types';

interface ChatSidebarProps {
  sessions: ChatSession[];
  selectedContactId: string | null;
  onSelectSession: (contactId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ sessions, selectedContactId, onSelectSession }) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
        width: { xs: '100%', md: 320 }, 
        height: '100%', 
        borderRight: { md: 1 }, 
        borderColor: 'divider',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper'
    }}>
      {/* Search Header */}
      <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="800" gutterBottom sx={{ mb: 2 }}>Messages</Typography>
        <TextField
            fullWidth
            size="small"
            placeholder="Search students..."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search size={18} color={theme.palette.text.secondary} />
                    </InputAdornment>
                )
            }}
            sx={{ 
                '& .MuiOutlinedInput-root': { 
                    bgcolor: alpha(theme.palette.action.hover, 0.05),
                    borderRadius: 1,
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: `1px solid ${theme.palette.primary.main}` }
                } 
            }}
        />
      </Box>

      {/* Chat List */}
      <List sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
        {sessions.map((session) => (
            <ListItemButton
                key={session.contactId}
                selected={selectedContactId === session.contactId}
                onClick={() => onSelectSession(session.contactId)}
                sx={{
                    mb: 0.5,
                    borderRadius: 1,
                    borderLeft: 'none', // Remove old border
                    bgcolor: selectedContactId === session.contactId ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: selectedContactId === session.contactId ? 'primary.main' : 'text.primary',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                }}
            >
                <ListItemAvatar>
                    <Badge 
                        color="success" 
                        variant="dot" 
                        overlap="circular" 
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        sx={{ '& .MuiBadge-badge': { border: `2px solid ${theme.palette.background.paper}` } }}
                    >
                        <Avatar src={session.contactAvatar} alt={session.contactName} sx={{ width: 44, height: 44 }}>
                            {session.contactName.charAt(0)}
                        </Avatar>
                    </Badge>
                </ListItemAvatar>
                <ListItemText 
                    primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={selectedContactId === session.contactId ? 700 : 600} color="text.primary">
                                {session.contactName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {new Date(session.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    }
                    secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography 
                                variant="body2" 
                                color={selectedContactId === session.contactId ? 'primary.main' : 'text.secondary'} 
                                noWrap 
                                sx={{ maxWidth: 160, opacity: selectedContactId === session.contactId ? 1 : 0.8 }}
                            >
                                {session.lastMessage}
                            </Typography>
                            {session.unreadCount > 0 && (
                                <Badge badgeContent={session.unreadCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }} />
                            )}
                        </Box>
                    }
                />
            </ListItemButton>
        ))}
        {sessions.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No conversations yet.</Typography>
            </Box>
        )}
      </List>
    </Box>
  );
};
