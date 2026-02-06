import { Chip, useTheme, alpha } from '@mui/material';
import { RequestStatus } from '../types';

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const theme = useTheme();

  const getColorProps = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return { 
            bgcolor: alpha(theme.palette.warning.main, 0.1), 
            color: theme.palette.warning.main,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
        };
      case 'Scheduled':
      case 'Accepted':
        return { 
            bgcolor: alpha(theme.palette.success.main, 0.1), 
            color: theme.palette.success.main,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
        };
      case 'Completed':
        return { 
            bgcolor: alpha(theme.palette.info.main, 0.1), 
            color: theme.palette.info.main,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
        };
      case 'Rescheduled':
        return { 
            bgcolor: alpha(theme.palette.secondary.main, 0.1), 
            color: theme.palette.secondary.main,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
        };
      case 'Rejected':
        return { 
            bgcolor: alpha(theme.palette.error.main, 0.1), 
            color: theme.palette.error.main,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
        };
      default:
        return { 
            bgcolor: alpha(theme.palette.text.secondary, 0.1), 
            color: theme.palette.text.secondary,
            border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`
        };
    }
  };

  const styles = getColorProps(status);

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: styles.bgcolor,
        color: styles.color,
        fontWeight: 600,
        border: styles.border,
        borderRadius: 1.5,
      }}
    />
  );
}