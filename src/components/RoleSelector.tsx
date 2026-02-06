import { UserRole } from '../types';
import { Card, CardContent, Typography, Box, Container, useTheme, alpha } from '@mui/material';
import { GraduationCap, Users, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const theme = useTheme();

  const roles = [
    {
      id: 'student',
      label: 'Student',
      description: 'Request meetings and submit issues',
      icon: <GraduationCap size={28} color="white" />,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      borderColor: alpha(theme.palette.primary.main, 0.3),
      bgColor: alpha(theme.palette.primary.main, 0.05),
      hoverColor: alpha(theme.palette.primary.main, 0.1)
    },
    {
      id: 'faculty',
      label: 'Faculty',
      description: 'Manage student requests and schedules',
      icon: <Users size={28} color="white" />,
      gradient: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`,
      borderColor: alpha(theme.palette.info.main, 0.3),
      bgColor: alpha(theme.palette.info.main, 0.05),
      hoverColor: alpha(theme.palette.info.main, 0.1)
    },
    {
      id: 'admin',
      label: 'Administrator',
      description: 'View analytics and manage system',
      icon: <Shield size={28} color="white" />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      borderColor: alpha(theme.palette.secondary.main, 0.3),
      bgColor: alpha(theme.palette.secondary.main, 0.05),
      hoverColor: alpha(theme.palette.secondary.main, 0.1)
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2, 
        position: 'relative', 
        overflow: 'hidden' 
      }}
    >
      {/* Animated background elements */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: -160, right: -160, width: 320, height: 320, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <Box sx={{ position: 'absolute', bottom: -160, left: -160, width: 320, height: 320, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1, backdropFilter: 'blur(10px)' }}>
                <Sparkles color="white" size={28} />
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1, textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                ResolvEd
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                Streamline faculty meetings and issue resolution
            </Typography>
        </Box>

        <Card sx={{ backdropFilter: 'blur(20px)', bgcolor: 'background.paper', borderRadius: 1, boxShadow: theme.shadows[10], border: 'none' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Select Your Role
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
              Choose how you want to access the platform
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {roles.map((role) => (
                <motion.div key={role.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Box 
                        onClick={() => onSelectRole(role.id as UserRole)}
                        sx={{ 
                            p: 2.5, 
                            borderRadius: 1, 
                            border: `2px solid ${role.borderColor}`, 
                            bgcolor: role.bgColor,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            '&:hover': {
                                boxShadow: theme.shadows[2],
                                bgcolor: role.hoverColor,
                                borderColor: role.borderColor
                            }
                        }}
                    >
                        <Box sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: 2, 
                            background: role.gradient, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: theme.shadows[2]
                        }}>
                            {role.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                                {role.label}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                {role.description}
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1,bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 10, backdropFilter: 'blur(4px)' }}>
                <Box sx={{ width: 8, height: 8, bgcolor: theme.palette.success.main, borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                    Demo Mode • All data is simulated
                </Typography>
            </Box>
        </Box>
      </Container>
    </Box>
  );
}