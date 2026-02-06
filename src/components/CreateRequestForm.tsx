import { useState } from 'react';
import { Faculty, FacultyType, IssueType } from '../types';
import { Button, Card, CardContent, TextField, Typography, Box, MenuItem, FormControl, InputLabel, Select, LinearProgress, IconButton, useTheme, alpha } from '@mui/material';
import { ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import { FileDropzone } from './FileDropzone';

interface CreateRequestFormProps {
  faculty: Faculty[];
  onSubmit: (data: any) => void;
  onBack: () => void;
  mode?: 'meeting' | 'upload';
}

export function CreateRequestForm({ faculty, onSubmit, onBack, mode = 'meeting' }: CreateRequestFormProps) {
  const [step, setStep] = useState(1);
  const theme = useTheme();
  
  // We'll store actual File objects for the Dropzone, but for the mock backend we'll just send names
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    facultyType: '' as FacultyType | '',
    facultyId: '',
    issueType: mode === 'upload' ? 'Assignment submission' : ('' as IssueType | ''),
    description: '',
    preferredDate: '',
    preferredTime: '',
  });

  const facultyTypes: FacultyType[] = [
    'Teacher', 'HOD', 'Dean', 'Sports Head', 'Discipline Council', 'Project Guide', 'Lab Assistant',
  ];

  const issueTypes: IssueType[] = [
    'Doubt clarification', 'Assignment submission', 'Attendance issue', 'Paper checking', 'Other',
  ];

  const filteredFaculty = formData.facultyType
    ? faculty.filter((f) => f.type === formData.facultyType)
    : faculty;

  const handleFilesSelected = (files: File[]) => {
    setAttachedFiles(prev => {
        // Prevent duplicates based on file name
        const newFiles = files.filter(f => !prev.some(existing => existing.name === f.name));
        return [...prev, ...newFiles];
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFaculty = faculty.find((f) => f.id === formData.facultyId);
    
    // For mock purpose, we convert Files to just strings (names)
    const attachmentNames = attachedFiles.map(f => f.name);

    if (selectedFaculty) {
      onSubmit({
        ...formData,
        facultyName: selectedFaculty.name,
        facultyType: selectedFaculty.type,
        attachments: attachmentNames,
        description: formData.description || 'No description provided.' // Fallback if empty
      });
    }
  };

  const canProceedToStep2 = formData.facultyType && formData.facultyId;
  const canSubmit =
    canProceedToStep2 && 
    formData.issueType && 
    (mode === 'upload' ? attachedFiles.length > 0 : formData.description); // Description optional for upload if files attached

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ 
          bgcolor: 'background.paper', 
          borderBottom: 1, 
          borderColor: 'divider', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' // Professional shadow
      }}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} sx={{ bgcolor: 'action.hover' }}>
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" fontWeight="700">
                {mode === 'upload' ? 'Upload Work' : 'Create Request'}
            </Typography>
            <Typography variant="caption" color="text.secondary">Step {step} of 2</Typography>
          </Box>
        </Box>
        <LinearProgress 
            variant="determinate" 
            value={step === 1 ? 50 : 100} 
            sx={{ 
                height: 4, 
                bgcolor: 'divider',
                '& .MuiLinearProgress-bar': {
                    borderRadius: '0 4px 4px 0'
                } 
            }} 
        />
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 2 }}>
            {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card sx={{ boxShadow: theme.shadows[2], borderRadius: 1 }}>
                    <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                        {mode === 'upload' ? 'Select Recipient' : 'Select Faculty'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {mode === 'upload' 
                            ? 'Choose the faculty member to whom you want to submit your work.'
                            : 'Choose the faculty member you wish to schedule a meeting with.'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel id="facultyType-label">Faculty Type</InputLabel>
                            <Select
                                labelId="facultyType-label"
                                label="Faculty Type"
                                value={formData.facultyType}
                                onChange={(e) =>
                                setFormData({ ...formData, facultyType: e.target.value as FacultyType, facultyId: '' })
                                }
                                sx={{ borderRadius: 1 }}
                            >
                                {facultyTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth disabled={!formData.facultyType}>
                            <InputLabel id="facultyMember-label">Faculty Member</InputLabel>
                            <Select
                                labelId="facultyMember-label"
                                label="Faculty Member"
                                value={formData.facultyId}
                                onChange={(e) =>
                                setFormData({ ...formData, facultyId: e.target.value })
                                }
                                sx={{ borderRadius: 2 }}
                            >
                                {filteredFaculty.map((f) => (
                                <MenuItem key={f.id} value={f.id}>
                                    <Box>
                                        <Typography variant="body1" fontWeight="500">{f.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{f.department}</Typography>
                                    </Box>
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    </CardContent>
                </Card>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 1, fontWeight: 600, boxShadow: theme.shadows[4] }}
                >
                Continue
                </Button>
            </Box>
            )}

            {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card sx={{ boxShadow: theme.shadows[2], borderRadius: 1 }}>
                    <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                        {mode === 'upload' ? 'Submission Details' : 'Request Details'}
                    </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {mode === 'upload' ? 'Attach your documents and add a brief description.' : 'Provide details about the agenda and your availability.'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl fullWidth disabled={mode === 'upload'}>
                            <InputLabel>Issue Type</InputLabel>
                            <Select
                                label="Issue Type"
                                value={formData.issueType}
                                onChange={(e) =>
                                setFormData({ ...formData, issueType: e.target.value as IssueType })
                                }
                                sx={{ borderRadius: 1 }}
                            >
                                {issueTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label={mode === 'upload' ? "Submission Note" : "Description"}
                            placeholder={mode === 'upload' ? "Enter brief details about this submission..." : "Describe your issue or request..."}
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                            }
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        {mode === 'meeting' && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Preferred Date"
                                    type="date"
                                    value={formData.preferredDate}
                                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    label="Preferred Time"
                                    type="time"
                                    value={formData.preferredTime}
                                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>
                        )}

                        <Box>
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ mt: 1 }}>
                                {mode === 'upload' ? 'Upload Documents' : 'Attachments'}
                            </Typography>
                            <FileDropzone 
                                onFilesSelected={handleFilesSelected}
                                currentFiles={attachedFiles}
                                onRemoveFile={removeFile}
                                acceptedTypes={mode === 'upload' ? ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'] : undefined}
                            />
                        </Box>
                    </Box>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setStep(1)}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
                >
                    Back
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    disabled={!canSubmit} 
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, boxShadow: theme.shadows[4] }}
                >
                    {mode === 'upload' ? 'Submit Work' : 'Submit Request'}
                </Button>
                </Box>
            </Box>
            )}
        </Box>
      </form>
    </Box>
  );
}
