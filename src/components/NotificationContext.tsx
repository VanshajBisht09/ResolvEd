import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'message';
  time: string;
  read: boolean;
}

interface NotificationContextType {
  showNotification: (message: string, type?: AlertColor) => void;
  notifications: NotificationItem[];
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    { id: '1', title: 'New Message', message: 'Prof. Smith replied to your inquiry.', type: 'message', time: '2 min ago', read: false },
    { id: '2', title: 'Request Approved', message: 'Your meeting request #REQ-402 was approved.', type: 'success', time: '1 hour ago', read: false },
    { id: '3', title: 'System Maintenance', message: 'Scheduled downtime this Sunday at 2 AM.', type: 'warning', time: '5 hours ago', read: true },
    { id: '4', title: 'Welcome!', message: 'Explore the new dashboard features.', type: 'info', time: '1 day ago', read: true },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const showNotification = useCallback((msg: string, type: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  const markAllAsRead = useCallback(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notifications, markAllAsRead, unreadCount }}>
      {children}
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert 
            onClose={handleClose} 
            severity={severity} 
            variant="filled"
            sx={{ 
                width: '100%', 
                borderRadius: 2, 
                boxShadow: 6,
                fontSize: '0.9rem',
                fontWeight: 500,
                alignItems: 'center'
            }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
