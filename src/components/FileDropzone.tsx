import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress, IconButton, Paper, alpha, useTheme } from '@mui/material';
import { Upload, X, FileText, Image as ImageIcon, File, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxSizeInBytes?: number; // Default 80MB
  acceptedTypes?: string[]; // e.g., ['image/*', 'application/pdf']
  currentFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

export function FileDropzone({
  onFilesSelected,
  maxSizeInBytes = 80 * 1024 * 1024, // 80 MB default as requested
  acceptedTypes,
  currentFiles = [],
  onRemoveFile
}: FileDropzoneProps) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeInBytes) {
      return `File ${file.name} exceeds the 80MB limit.`;
    }
    // Simple verification if acceptedTypes is provided
    if (acceptedTypes && acceptedTypes.length > 0) {
       // logic can be expanded, complex MIME type checking is tricky on client
       // For now, allow all if not strictly enforced, or check extensions
    }
    return null;
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    let errorMsg = null;

    Array.from(files).forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errorMsg = validationError;
      } else {
        validFiles.push(file);
      }
    });

    if (errorMsg) {
       setError(errorMsg);
       // Clear error after 5 seconds
       setTimeout(() => setError(null), 5000);
    }

    if (validFiles.length > 0) {
        // Simulate upload progress
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    onFilesSelected(validFiles);
                    return 0;
                }
                return prev + 10;
            });
        }, 150); 
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <ImageIcon size={20} />;
    if (ext === 'pdf') return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : error ? 'error.main' : 'divider',
          borderRadius: 1,
          p: 4,
          bgcolor: isDragging ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'center',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.02)
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          multiple
          accept={acceptedTypes?.join(',')}
        />
        
        <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.primary.main, 0.1), 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
        }}>
            <Upload size={24} color={theme.palette.primary.main} />
        </Box>

        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Click to upload or drag and drop
        </Typography>
        <Typography variant="body2" color="text.secondary">
          SVG, PNG, JPG or GIF (max. 80MB)
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, color: 'error.main' }}>
            <AlertCircle size={16} />
            <Typography variant="caption">{error}</Typography>
        </Box>
      )}

      {/* Progress Bar */}
      {isUploading && (
          <Box sx={{ mt: 2 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                 <Typography variant="caption" color="text.secondary">Uploading...</Typography>
                 <Typography variant="caption" fontWeight="bold">{uploadProgress}%</Typography>
             </Box>
             <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 1, height: 6 }} />
          </Box>
      )}

      {/* File List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
        {currentFiles.map((file, index) => (
          <Paper
            key={`${file.name}-${index}`}
            variant="outlined"
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               <Box sx={{ 
                   p: 1, 
                   bgcolor: alpha(theme.palette.primary.main, 0.1), 
                   borderRadius: 1,
                   color: 'primary.main'
               }}>
                   {getFileIcon(file.name)}
               </Box>
               <Box>
                   <Typography variant="body2" fontWeight="500" noWrap sx={{ maxWidth: 200 }}>{file.name}</Typography>
                   <Typography variant="caption" color="text.secondary">{formatFileSize(file.size)}</Typography>
               </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={16} color={theme.palette.success.main} />
                {onRemoveFile && (
                    <IconButton size="small" onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFile(index);
                    }}>
                        <X size={16} />
                    </IconButton>
                )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
