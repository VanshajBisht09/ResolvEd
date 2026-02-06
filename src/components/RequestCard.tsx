import { MeetingRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, MapPin, Building2, FileText, Video, User } from 'lucide-react';
import { Card, Box, Typography, Chip, useTheme, alpha } from '@mui/material';

interface RequestCardProps {
  request: MeetingRequest;
  viewMode: 'student' | 'faculty';
  onClick?: () => void;
}

export function RequestCard({ request, viewMode, onClick }: RequestCardProps) {
  const theme = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString;
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: theme.shadows[1],
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)'
        },
        mb: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            {viewMode === 'faculty' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <Box sx={{ 
                    width: 36, height: 36, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'primary.main'
                }}>
                  <User size={18} />
                </Box>
                <Box>
                    <Typography variant="subtitle2" fontWeight="600">{request.studentName}</Typography>
                    <Typography variant="caption" color="text.secondary">Student</Typography>
                </Box>
              </Box>
            )}
            {viewMode === 'student' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                    width: 36, height: 36, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'primary.main'
                }}>
                  <User size={18} />
                </Box>
                <Box>
                    <Typography variant="subtitle2" fontWeight="600">{request.facultyName}</Typography>
                    <Typography variant="caption" color="text.secondary">{request.facultyType}</Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Typography variant="h6" fontWeight="700" sx={{ color: 'text.primary', mt: 1 }}>{request.issueType}</Typography>
        </Box>
        <StatusBadge status={request.status} />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40 }}>
        {request.description}
      </Typography>

      {request.attachments && request.attachments.length > 0 && (
        <Chip 
            icon={<FileText size={14} />} 
            label={`${request.attachments.length} File${request.attachments.length > 1 ? 's' : ''} Attached`} 
            size="small" 
            variant="outlined"
            sx={{ 
                bgcolor: alpha(theme.palette.secondary.main, 0.05), 
                color: 'secondary.main', 
                borderColor: alpha(theme.palette.secondary.main, 0.3),
                fontWeight: 600,
                alignSelf: 'flex-start',
                mt: 1,
                mb: 2
            }}
        />
      )}

      {request.status === 'Scheduled' && request.scheduledDate && (
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1), display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', color: 'primary.contrastText' }}>
                <Calendar size={16} />
            </Box>
            <Typography variant="body2" fontWeight="600" color="text.primary">
              {formatDate(request.scheduledDate)} at {formatTime(request.scheduledTime)}
            </Typography>
          </Box>
          
          {request.roomNumber && request.buildingName && (
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', color: 'primary.contrastText' }}>
                    <MapPin size={16} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Room {request.roomNumber}, {request.buildingName}
                </Typography>
            </Box>
          )}

          {request.meetingMode && (
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', color: 'primary.contrastText' }}>
                    {request.meetingMode === 'Online' ? <Video size={16} /> : <Building2 size={16} />}
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {request.meetingMode}
                </Typography>
            </Box>
          )}
        </Box>
      )}

      {request.status === 'Accepted' && request.facultyNotes && (
         <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.1) }}>
             <Typography variant="body2" color="text.primary">
                 <Box component="span" fontWeight="700" color="info.main">Note: </Box>
                 {request.facultyNotes}
             </Typography>
         </Box>
      )}

      {request.status === 'Pending' && request.preferredDate && (
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'text.secondary', opacity: 0.8 }}>
             <Clock size={16} />
             <Typography variant="caption" fontWeight="500">
                Preferred: {formatDate(request.preferredDate)} at {formatTime(request.preferredTime)}
             </Typography>
         </Box>
      )}

      {request.status === 'Completed' && (
        <Box sx={{ mt: 1.5, display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', borderRadius: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
            <Typography variant="caption" fontWeight="700">
                Completed on {formatDate(request.scheduledDate)}
            </Typography>
        </Box>
      )}
    </Card>
  );
}