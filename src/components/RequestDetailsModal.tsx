import { MeetingRequest } from '../types';
import { Dialog, DialogContent, DialogTitle, Box, Typography, Button, IconButton } from '@mui/material';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, MapPin, Building2, FileText, Video, User, MessageSquare, X } from 'lucide-react';

interface RequestDetailsModalProps {
  request: MeetingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'student' | 'faculty';
}

export function RequestDetailsModal({
  request,
  isOpen,
  onClose,
  viewMode,
}: RequestDetailsModalProps) {
  if (!request) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Request Details
        <IconButton onClick={onClose} size="small">
            <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <StatusBadge status={request.status} />
          </Box>

          {/* Participants */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ mt: 0.5 }}>
                <User size={20} color="gray" />
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary">
                    {viewMode === 'student' ? 'Faculty' : 'Student'}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                    {viewMode === 'student' ? request.facultyName : request.studentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">{request.facultyType}</Typography>
            </Box>
          </Box>

          {/* Issue Details */}
          <Box>
             <Typography variant="body2" color="text.secondary" gutterBottom>Issue Type</Typography>
             <Typography variant="body1" fontWeight="500">{request.issueType}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
            <Typography variant="body1">{request.description}</Typography>
          </Box>

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Attachments</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {request.attachments.map((file, index) => (
                  <Box
                    key={index}
                    sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <FileText size={16} color="gray" />
                    <Typography variant="body2" sx={{ flex: 1 }} noWrap>{file}</Typography>
                    <Button size="small" sx={{ minWidth: 'auto' }}>
                      View
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Scheduled Meeting Details */}
          {request.status === 'Scheduled' && request.scheduledDate && (
            <Box sx={{ p: 2, bgcolor: 'rgba(79, 70, 229, 0.05)', borderRadius: 2, border: '1px solid rgba(79, 70, 229, 0.1)' }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>Meeting Schedule</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Calendar size={20} color="#4f46e5" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                    <Typography variant="subtitle2">
                      {formatDate(request.scheduledDate)}
                    </Typography>
                    <Typography variant="body2" color="text.primary">{formatTime(request.scheduledTime)}</Typography>
                  </Box>
                </Box>

                {request.roomNumber && request.buildingName && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <MapPin size={20} color="#4f46e5" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="subtitle2">
                        Room {request.roomNumber}
                      </Typography>
                      <Typography variant="body2" color="text.primary">{request.buildingName}</Typography>
                    </Box>
                  </Box>
                )}

                {request.meetingMode && (
                   <Box sx={{ display: 'flex', gap: 2 }}>
                     {request.meetingMode === 'Online' ? <Video size={20} color="#4f46e5" /> : <Building2 size={20} color="#4f46e5" />}
                    <Box>
                      <Typography variant="body2" color="text.secondary">Mode</Typography>
                      <Typography variant="subtitle2">{request.meetingMode}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Accepted with Notes */}
          {request.status === 'Accepted' && request.facultyNotes && (
             <Box sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 2, border: '1px solid rgba(59, 130, 246, 0.1)' }}>
               <Box sx={{ display: 'flex', gap: 1 }}>
                 <MessageSquare size={20} color="#2563eb" />
                 <Box>
                   <Typography variant="subtitle2" color="primary" gutterBottom>Faculty Note</Typography>
                   <Typography variant="body2" color="text.primary">{request.facultyNotes}</Typography>
                 </Box>
               </Box>
            </Box>
          )}

          {/* Preferred Time (Pending) */}
          {request.status === 'Pending' && request.preferredDate && (
             <Box>
               <Typography variant="body2" color="text.secondary" gutterBottom>Preferred Date & Time</Typography>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Clock size={16} color="gray" />
                 <Typography variant="body1">
                  {formatDate(request.preferredDate)} at {formatTime(request.preferredTime)}
                 </Typography>
               </Box>
             </Box>
          )}

          {/* Timeline */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Timeline</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: 'grey.400', borderRadius: '50%', mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" fontWeight="500">Submitted</Typography>
                  <Typography variant="caption" color="text.secondary">{formatDateTime(request.createdAt)}</Typography>
                </Box>
              </Box>
              {request.updatedAt !== request.createdAt && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="500">Updated</Typography>
                    <Typography variant="caption" color="text.secondary">{formatDateTime(request.updatedAt)}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

            <Button onClick={onClose} variant="contained" fullWidth size="large">
              Close
            </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
