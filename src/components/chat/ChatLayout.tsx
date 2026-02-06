
import React from 'react';
import { Box, Card, useTheme, useMediaQuery } from '@mui/material';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { ChatSession } from '../../types';

interface ChatLayoutProps {
  sessions: ChatSession[];
  currentUser: { id: string; name: string };
  selectedContactId: string | null;
  onSelectSession: (contactId: string) => void;
  onSendMessage: (text: string) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ 
    sessions, 
    currentUser, 
    selectedContactId, 
    onSelectSession, 
    onSendMessage 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const activeSession = sessions.find(s => s.contactId === selectedContactId) || null;

  return (
    <Card sx={{ 
        height: 'calc(100vh - 100px)', // Adjust based on header/padding
        display: 'flex', 
        borderRadius: 1, 
        overflow: 'hidden', 
        boxShadow: theme.shadows[4],
        border: '1px solid',
        borderColor: 'divider'
    }}>
      {(!isMobile || !selectedContactId) && (
          <ChatSidebar 
            sessions={sessions} 
            selectedContactId={selectedContactId} 
            onSelectSession={onSelectSession} 
          />
      )}
      
      {(!isMobile || selectedContactId) && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <ChatWindow 
                  session={activeSession} 
                  onSendMessage={onSendMessage} 
                  currentUser={currentUser} 
               />
          </Box>
      )}
    </Card>
  );
};
