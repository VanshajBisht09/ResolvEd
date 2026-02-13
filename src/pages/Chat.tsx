import React, { useState } from 'react';
import { useData } from '../components/DataContext';
import { useUser } from '../components/MockAuth';
import { ChatLayout } from '../components/chat/ChatLayout';
import { Box, Typography } from '@mui/material';

export const ChatView: React.FC = () => {
  const { chats, sendMessage, markChatRead } = useData();
  const { user } = useUser();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  if (!user) {
    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Please sign in to view messages.</Typography>
        </Box>
    );
  }

  const handleSendMessage = (text: string) => {
    if (selectedContactId) {
        sendMessage(selectedContactId, text, user.id, user.name);
    }
  };

  const handleSelectSession = (contactId: string) => {
      setSelectedContactId(contactId);
      markChatRead(contactId);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', p: 2 }}>
      <ChatLayout
        sessions={chats}
        currentUser={{ id: user.id, name: user.name }}
        selectedContactId={selectedContactId}
        onSelectSession={handleSelectSession}
        onSendMessage={handleSendMessage}
      />
    </Box>
  );
};
