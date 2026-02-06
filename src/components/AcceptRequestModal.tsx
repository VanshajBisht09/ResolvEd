import { useState } from 'react';
import { MeetingRequest, MeetingMode } from '../types';
import { Dialog, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Box, Typography, IconButton } from '@mui/material';
import { X } from 'lucide-react';

interface AcceptRequestModalProps {
  request: MeetingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (data: {
    requestId: string;
    scheduledDate: string;
    scheduledTime: string;
    roomNumber?: string;
    buildingName?: string;
    meetingMode: MeetingMode;
    facultyNotes?: string;
  }) => void;
}

export function AcceptRequestModal({
  request,
  isOpen,
  onClose,
  onAccept,
}: AcceptRequestModalProps) {
  const [formData, setFormData] = useState({
    scheduledDate: request?.preferredDate || '',
    scheduledTime: request?.preferredTime || '',
    roomNumber: '',
    buildingName: '',
    meetingMode: 'In-person' as MeetingMode,
    facultyNotes: '',
  });

  const buildings = [
    'Main Building',
    'CS Building',
    'Engineering Block A',
    'Engineering Block B',
    'Science Block',
    'Administration Building',
    'Sports Complex',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request) {
      onAccept({
        requestId: request.id,
        ...formData,
      });
      onClose();
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Schedule Meeting
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Student Info */}
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Student</Typography>
              <Typography variant="subtitle1" fontWeight="600">{request.studentName}</Typography>
              <Typography variant="body2" color="text.secondary">{request.issueType}</Typography>
            </Box>

            {/* Date & Time */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
              <TextField
                label="Time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            {/* Meeting Mode */}
            <FormControl>
              <Typography variant="subtitle2" gutterBottom>Meeting Mode *</Typography>
              <RadioGroup
                row
                value={formData.meetingMode}
                onChange={(e) => setFormData({ ...formData, meetingMode: e.target.value as MeetingMode })}
              >
                <FormControlLabel value="In-person" control={<Radio />} label="In-person" />
                <FormControlLabel value="Online" control={<Radio />} label="Online" />
              </RadioGroup>
            </FormControl>

            {/* Location (only for in-person) */}
            {formData.meetingMode === 'In-person' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="building-label">Building</InputLabel>
                  <Select
                    labelId="building-label"
                    value={formData.buildingName}
                    label="Building"
                    onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                  >
                    {buildings.map((building) => (
                      <MenuItem key={building} value={building}>{building}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Room Number"
                  placeholder="e.g., 305"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  fullWidth
                />
              </Box>
            )}

            {/* Faculty Notes */}
            <TextField
              label="Notes to Student (Optional)"
              placeholder="Any special instructions or requirements..."
              multiline
              rows={3}
              value={formData.facultyNotes}
              onChange={(e) => setFormData({ ...formData, facultyNotes: e.target.value })}
              fullWidth
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
              <Button variant="outlined" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth>
                Schedule Meeting
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
