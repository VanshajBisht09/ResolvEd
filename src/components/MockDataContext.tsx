import React, { createContext, useContext, useState, useEffect } from 'react';
import { MeetingRequest, RequestStatus } from '../types';

interface MockDataContextType {
  requests: MeetingRequest[];
  addRequest: (request: MeetingRequest) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Initial Seed Data
const INITIAL_REQUESTS: MeetingRequest[] = [
  {
    id: '1',
    studentId: 'std1',
    studentName: 'Alex Johnson',
    facultyId: 'fac1',
    facultyName: 'Dr. Sarah Smith',
    facultyType: 'Teacher',
    issueType: 'Doubt clarification',
    description: 'Need help with Advanced Algorithms assignment.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferredDate: '2026-02-10',
    preferredTime: '10:00 AM'
  },
  {
    id: '2',
    studentId: 'std2',
    studentName: 'Maria Garcia',
    facultyId: 'fac1',
    facultyName: 'Dr. Sarah Smith',
    facultyType: 'Teacher',
    issueType: 'Paper checking',
    description: 'Review mid-term paper grades.',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scheduledDate: '2026-02-02',
    scheduledTime: '2:00 PM',
    roomNumber: '304',
    buildingName: 'Science Block'
  }
];

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MeetingRequest[]>(() => {
    const saved = localStorage.getItem('mock_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Sync with localStorage and cross-tab updates
  useEffect(() => {
    localStorage.setItem('mock_requests', JSON.stringify(requests));
    
    // Dispatch event for other listeners in same tab (if any)
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'mock_requests',
        newValue: JSON.stringify(requests)
    }));
  }, [requests]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
        if (e.key === 'mock_requests' && e.newValue) {
            setRequests(JSON.parse(e.newValue));
        }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addRequest = (request: MeetingRequest) => {
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status, updatedAt: new Date().toISOString() } : req
    ));
  };

  return (
    <MockDataContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
