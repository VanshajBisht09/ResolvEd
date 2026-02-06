export type UserRole = 'student' | 'faculty' | 'admin';

export type FacultyType = 'Teacher' | 'HOD' | 'Dean' | 'Sports Head' | 'Discipline Council' | 'Project Guide' | 'Lab Assistant' | 'Lab Incharge';

export type IssueType = 
  | 'Doubt clarification'
  | 'Assignment submission'
  | 'Attendance issue'
  | 'Paper checking'
  | 'Project Approval'
  | 'Lab Access'
  | 'Leave Application'
  | 'Other';

export type RequestStatus = 'Pending' | 'Accepted' | 'Approved' | 'Scheduled' | 'Rescheduled' | 'Completed' | 'Rejected';

export type MeetingMode = 'In-person' | 'Online';

export interface Faculty {
  id: string;
  name: string;
  type: FacultyType;
  department: string;
  email: string;
  avatar?: string;
}

export interface MeetingRequest {
  id: string;
  studentId: string;
  studentName: string;
  facultyId: string;
  facultyName: string;
  facultyType: FacultyType;
  issueType: IssueType;
  description: string;
  preferredDate?: string;
  preferredTime?: string;
  attachments?: string[];
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  roomNumber?: string;
  buildingName?: string;
  meetingMode?: MeetingMode;
  rooms?: string; // Legacy field, keeping for safety if used elsewhere
  facultyNotes?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  facultyType?: FacultyType;
  avatar?: string;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // Added for flat store
  text: string;
  timestamp: string;
  isRead: boolean;
  attachment?: {
    name: string;
    type: 'image' | 'file';
    url?: string;
    size?: string;
  };
}

export interface ChatSession {
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  online?: boolean; // Added status
}
