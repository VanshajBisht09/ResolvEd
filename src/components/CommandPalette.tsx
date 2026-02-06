import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    TextField, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemIcon, 
    ListItemText, 
    Typography, 
    Box, 
    InputAdornment, 
    useTheme, 
    alpha 
} from '@mui/material';
import { 
    Search, 
    LayoutDashboard, 
    MessageSquare, 
    Settings, 
    Users, 
    FileText, 
    LogOut, 
    Moon, 
    Sun,
    Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router or similar prop based nav
import { useColorMode } from './ThemeContext';
import { useUser } from './MockAuth';

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
    onNavigate: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onNavigate }) => {
    const theme = useTheme();
    const { toggleColorMode, mode } = useColorMode();
    const { signOut, user } = useUser();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands = [
        { category: 'Navigation', icon: <LayoutDashboard size={20} />, label: 'Go to Dashboard', action: () => onNavigate('Dashboard') },
        { category: 'Navigation', icon: <MessageSquare size={20} />, label: 'Go to Messages', action: () => onNavigate('Messages') },
        { category: 'Navigation', icon: <FileText size={20} />, label: 'Go to Complaints', action: () => onNavigate('Complaints') },
        { category: 'Navigation', icon: <Settings size={20} />, label: 'Go to Settings', action: () => onNavigate('Settings') },
        { category: 'Actions', icon: mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: `Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`, action: toggleColorMode },
        { category: 'Actions', icon: <LogOut size={20} />, label: 'Log Out', action: signOut },
    ];

    if (user?.publicMetadata?.role === 'admin') {
        commands.splice(4, 0, { category: 'Navigation', icon: <Users size={20} />, label: 'Manage Users', action: () => onNavigate('Users') });
    }

    const filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                onClose();
            }
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    backgroundImage: 'none',
                    borderRadius: 1,
                    boxShadow: theme.shadows[10],
                    overflow: 'hidden'
                }
            }}
            TransitionProps={{
                onEnter: () => setQuery('')
            }}
        >
            <Box sx={{ p: 2, pb: 0 }}>
                <TextField
                    fullWidth
                    autoFocus
                    placeholder="Type a command or search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} color={theme.palette.text.secondary} />
                            </InputAdornment>
                        ),
                        disableUnderline: true,
                        sx: { fontSize: '1.1rem' }
                    }}
                    variant="standard"
                />
            </Box>
            <DialogContent sx={{ p: 1, minHeight: 300 }}>
                <List>
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <ListItemButton 
                                key={index} 
                                onClick={() => { cmd.action(); onClose(); }}
                                selected={index === selectedIndex}
                                sx={{ 
                                    borderRadius: 1, 
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                    {cmd.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={cmd.label} 
                                    secondary={cmd.category}
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                    secondaryTypographyProps={{ variant: 'caption', fontSize: '0.7rem' }}
                                />
                                {index === selectedIndex && (
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                                        Enter
                                    </Typography>
                                )}
                            </ListItemButton>
                        ))
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                            <Typography>No results found.</Typography>
                        </Box>
                    )}
                </List>
            </DialogContent>
            <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ px: 0.8, py: 0.2, bgcolor: alpha(theme.palette.divider, 0.5), borderRadius: 1, fontSize: '0.7rem', fontWeight: 700 }}>↑↓</Box>
                    <Typography variant="caption">to navigate</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ px: 0.8, py: 0.2, bgcolor: alpha(theme.palette.divider, 0.5), borderRadius: 1, fontSize: '0.7rem', fontWeight: 700 }}>esc</Box>
                    <Typography variant="caption">to close</Typography>
                </Box>
            </Box>
        </Dialog>
    );
};
