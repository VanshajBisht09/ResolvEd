import React, { useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    TextField, 
    Button, 
    IconButton, 
    InputAdornment, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Container, 
    Alert,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import { Eye, EyeOff, ArrowLeft, Lock, Mail, UserCircle } from 'lucide-react';
import { useUser } from '../components/MockAuth';
import { motion } from 'framer-motion';

interface LoginPageProps {
    onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
    const theme = useTheme();
    const { signIn } = useUser();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Simple Mock Validation
            if (!email || !password) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            if (password.length < 4) {
                setError('Password must be at least 4 characters');
                setLoading(false);
                return;
            }

            // Success
            signIn(role);
        }, 1500);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'background.default',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <Box sx={{ 
                position: 'absolute', 
                top: -100, 
                right: -100, 
                width: 400, 
                height: 400, 
                borderRadius: '50%', 
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)` 
            }} />
            <Box sx={{ 
                position: 'absolute', 
                bottom: -100, 
                left: -100, 
                width: 300, 
                height: 300, 
                borderRadius: '50%', 
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)` 
            }} />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    <Card sx={{ 
                        borderRadius: 1, 
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                        overflow: 'visible'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                <Box sx={{ 
                                    width: 56, height: 56, 
                                    borderRadius: 1, 
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    mb: 2,
                                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
                                }}>
                                    <Lock size={28} />
                                </Box>
                                <Typography variant="h5" fontWeight="700">Welcome Back</Typography>
                                <Typography variant="body2" color="text.secondary">Sign in to your dashboard</Typography>
                            </Box>

                            {/* Error Alert */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>{error}</Alert>
                            )}

                            <form onSubmit={handleLogin}>
                                {/* Role Selection */}
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Select Role</InputLabel>
                                    <Select
                                        value={role}
                                        label="Select Role"
                                        onChange={(e) => setRole(e.target.value as any)}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <UserCircle size={20} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="student">Student</MenuItem>
                                        <MenuItem value="teacher">Faculty Member</MenuItem>
                                        <MenuItem value="admin">Administrator</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Email Field */}
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail size={20} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* Password Field */}
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ mb: 4 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={20} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    size="large"
                                    type="submit"
                                    disabled={loading}
                                    sx={{ 
                                        py: 1.5, 
                                        borderRadius: 1, 
                                        fontSize: '1rem',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Footer Actions */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                         <Button 
                            startIcon={<ArrowLeft size={18} />} 
                            onClick={onBack}
                            sx={{ color: 'text.secondary' }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};
