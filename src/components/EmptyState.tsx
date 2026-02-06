import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8,
        px: 3,
        textAlign: 'center',
        opacity: 0.8
      }}
    >
      <Box 
        sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          bgcolor: alpha(theme.palette.primary.main, 0.05), 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 3,
          color: theme.palette.primary.main
        }}
      >
        <Icon size={40} strokeWidth={1.5} />
      </Box>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button 
            variant="outlined" 
            onClick={onAction}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
