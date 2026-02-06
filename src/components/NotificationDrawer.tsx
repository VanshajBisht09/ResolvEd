import React from 'react';
import { 
    Drawer, 
    Box, 
    Typography, 
    IconButton, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar, 
    Divider, 
    Button,
    alpha,
    useTheme
} from '@mui/material';
import { X, Bell, MessageSquare, CheckCircle, AlertTriangle, Info } from 'lucide-react';

import { useNotification } from './NotificationContext';

interface NotificationDrawerProps {
    open: boolean;
    onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const { notifications, markAllAsRead } = useNotification();

    const getIcon = (type: string) => {
        switch(type) {
            case 'message': return <MessageSquare size={18} />;
            case 'success': return <CheckCircle size={18} />;
            case 'warning': return <AlertTriangle size={18} />;
            default: return <Info size={18} />;
        }
    };

    const getColor = (type: string) => {
        switch(type) {
            case 'message': return theme.palette.primary.main;
            case 'success': return theme.palette.success.main;
            case 'warning': return theme.palette.warning.main;
            default: return theme.palette.info.main;
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 320, p: 0 }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bell size={20} color={theme.palette.primary.main} />
                    <Typography variant="h6" fontWeight={700}>Notifications</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <X size={20} />
                </IconButton>
            </Box>

            <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                        <ListItem 
                            alignItems="flex-start" 
                            sx={{ 
                                bgcolor: notification.read ? 'transparent' : alpha(getColor(notification.type), 0.05),
                                '&:hover': { bgcolor: 'action.hover' },
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                px: 2, py: 2
                            }}
                        >
                            <ListItemAvatar sx={{ minWidth: 48 }}>
                                <Avatar sx={{ 
                                    bgcolor: alpha(getColor(notification.type), 0.1), 
                                    color: getColor(notification.type),
                                    width: 36, height: 36
                                }}>
                                    {getIcon(notification.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="subtitle2" fontWeight={700}>{notification.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                                        {notification.message}
                                    </Typography>
                                }
                            />
                            {!notification.read && (
                                <Box sx={{ 
                                    width: 8, height: 8, borderRadius: '50%', 
                                    bgcolor: 'error.main', 
                                    position: 'absolute', top: 20, right: 10 
                                }} />
                            )}
                        </ListItem>
                        {index < notifications.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>

            <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    onClick={markAllAsRead}
                >
                    Mark all as read
                </Button>
            </Box>
        </Drawer>
    );
};
