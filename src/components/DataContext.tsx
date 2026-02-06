import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MeetingRequest,
  RequestStatus,
  User,
  ChatSession,
  ChatMessage,
} from "../types";
import { useUser as useMockUser } from "./MockAuth";
import io from "socket.io-client";
import axios from "axios";
import { useNotification } from "./NotificationContext";

// Create a socket instance
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

interface DataContextType {
  requests: MeetingRequest[];
  faculty: User[];
  chats: ChatSession[];
  addRequest: (request: MeetingRequest) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus) => Promise<void>;
  sendMessage: (
    studentId: string,
    text: string,
    senderId: string,
    senderName: string,
    attachment?: ChatMessage["attachment"]
  ) => void;
  markChatRead: (studentId: string) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoaded } = useMockUser();
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [faculty, setFaculty] = useState<User[]>([]);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  // Dummy Data for Demo
  const DUMMY_FACULTY: User[] = [
    {
      id: "fac1",
      name: "Dr. Sarah Smith",
      email: "sarah.smith@uni.edu",
      role: "faculty",
      department: "Computer Science",
      facultyType: "HOD",
      avatar: "https://i.pravatar.cc/150?u=fac1",
    },
    {
      id: "fac2",
      name: "Dr. John Doe",
      email: "john.doe@uni.edu",
      role: "faculty",
      department: "Physics",
      facultyType: "Teacher",
      avatar: "https://i.pravatar.cc/150?u=fac2",
    },
    {
      id: "fac3",
      name: "Prof. Alan Turing",
      email: "alan@uni.edu",
      role: "faculty",
      department: "Mathematics",
      facultyType: "Dean",
      avatar: "https://i.pravatar.cc/150?u=fac3",
    },
    {
      id: "fac4",
      name: "Dr. Emily Blunt",
      email: "emily@uni.edu",
      role: "faculty",
      department: "Chemistry",
      facultyType: "Lab Incharge",
      avatar: "https://i.pravatar.cc/150?u=fac4",
    },
    {
      id: "fac5",
      name: "Prof. Robert Langdon",
      email: "robert@uni.edu",
      role: "faculty",
      department: "History",
      facultyType: "Teacher",
      avatar: "https://i.pravatar.cc/150?u=fac5",
    },
    {
      id: "fac6",
      name: "Dr. Lisa Kudrow",
      email: "lisa@uni.edu",
      role: "faculty",
      department: "Biology",
      facultyType: "Teacher",
      avatar: "https://i.pravatar.cc/150?u=fac6",
    },
    {
      id: "fac7",
      name: "Mr. Ross Geller",
      email: "ross@uni.edu",
      role: "faculty",
      department: "Paleontology",
      facultyType: "Teacher",
      avatar: "https://i.pravatar.cc/150?u=fac7",
    },
    {
      id: "fac8",
      name: "Dean Pelton",
      email: "dean@uni.edu",
      role: "faculty",
      department: "Administration",
      facultyType: "Dean",
      avatar: "https://i.pravatar.cc/150?u=fac8",
    },
  ];

  /* 
     Mock Student IDs: 'std1' (Alex usually)
  */
  const DUMMY_MESSAGES: ChatMessage[] = [
    // Thread with Dr. Sarah (HOD) - Academic Pressure
    {
      id: "m1",
      senderId: "fac1",
      senderName: "Dr. Sarah Smith",
      receiverId: "std1",
      text: "Alex, please review the comments on your last submission.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true,
    },
    {
      id: "m2",
      senderId: "std1",
      senderName: "Alex Johnson",
      receiverId: "fac1",
      text: "Sure, I have updated the diagram as requested.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      isRead: true,
    },
    {
      id: "m3",
      senderId: "fac1",
      senderName: "Dr. Sarah Smith",
      receiverId: "std1",
      text: "Great. Also, prepared for the viva?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      isRead: true,
    },
    {
      id: "m4",
      senderId: "std1",
      senderName: "Alex Johnson",
      receiverId: "fac1",
      text: "Yes, just revising the last module.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
    },

    // Thread with Prof. Alan (Math) - Casual/Doubt
    {
      id: "m5",
      senderId: "std1",
      senderName: "Alex Johnson",
      receiverId: "fac3",
      text: "Sir, is the Calculus class cancelled?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      isRead: true,
    },
    {
      id: "m6",
      senderId: "fac3",
      senderName: "Prof. Alan Turing",
      receiverId: "std1",
      text: "Yes, Alex. I am attending a conference.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
      isRead: true,
    },

    // Thread with Dr. John (Physics) - Lab Work
    {
      id: "m7",
      senderId: "fac2",
      senderName: "Dr. John Doe",
      receiverId: "std1",
      text: "Don't forget your lab coat tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
    },

    // Thread between Faculty (Sarah <-> John) - Admin stuff (Simulated view for Faculty)
    {
      id: "m8",
      senderId: "fac1",
      senderName: "Dr. Sarah Smith",
      receiverId: "fac2",
      text: "John, did you submit the grades?",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      isRead: true,
    },
  ];

  const DUMMY_REQUESTS: MeetingRequest[] = [
    // --- Current User Requests (Alex Johnson) ---
    {
      id: "1",
      studentId: "std1",
      studentName: "Alex Johnson",
      facultyId: "fac1",
      facultyName: "Dr. Sarah Smith",
      facultyType: "HOD",
      issueType: "Doubt clarification",
      description: "Need help with Advanced Algorithms assignment.",
      status: "Pending",
      createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      preferredDate: "2026-02-10",
      preferredTime: "10:00 AM",
    },
    {
      id: "2",
      studentId: "std1",
      studentName: "Alex Johnson",
      facultyId: "fac3",
      facultyName: "Prof. Alan Turing",
      facultyType: "Dean",
      issueType: "Project Approval",
      description: "Requesting approval for final year AI project.",
      status: "Approved",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      preferredDate: "2026-02-02",
      preferredTime: "02:00 PM",
      scheduledDate: "2026-02-02",
      scheduledTime: "02:00 PM",
      roomNumber: "304",
      buildingName: "Main Block",
    },
    {
      id: "3",
      studentId: "std1",
      studentName: "Alex Johnson",
      facultyId: "fac2",
      facultyName: "Dr. John Doe",
      facultyType: "Teacher",
      issueType: "Lab Access",
      description: "Need extra time in Physics lab for experiment.",
      status: "Rejected",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      rejectionReason: "Lab is under maintenance.",
    },
    {
      id: "4",
      studentId: "std1",
      studentName: "Alex Johnson",
      facultyId: "fac5",
      facultyName: "Prof. Robert Langdon",
      facultyType: "Teacher",
      issueType: "Assignment submission",
      description: "Submitting History research paper.",
      status: "Pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      preferredDate: "2026-02-12",
      preferredTime: "11:00 AM",
    },

    // --- Requests for Faculty View (Dr. Sarah - fac1) ---
    {
      id: "5",
      studentId: "std2",
      studentName: "Emma Watson",
      facultyId: "fac1",
      facultyName: "Dr. Sarah Smith",
      facultyType: "HOD",
      issueType: "Leave Application",
      description: "Going home for sister's wedding.",
      status: "Pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      preferredDate: "2026-02-15",
      preferredTime: "09:00 AM",
    },
    {
      id: "6",
      studentId: "std3",
      studentName: "Ron Weasley",
      facultyId: "fac1",
      facultyName: "Dr. Sarah Smith",
      facultyType: "HOD",
      issueType: "Assignment submission",
      description: "Late submission of potion report.",
      status: "Pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      preferredDate: "2026-02-11",
      preferredTime: "04:00 PM",
    },
    {
      id: "7",
      studentId: "std4",
      studentName: "Harry Potter",
      facultyId: "fac1",
      facultyName: "Dr. Sarah Smith",
      facultyType: "HOD",
      issueType: "Doubt clarification",
      description: "Confusion regarding dark arts defense.",
      status: "Scheduled",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 0.8).toISOString(),
      preferredDate: "2026-02-02",
      preferredTime: "03:00 PM",
      scheduledDate: "2026-02-02",
      scheduledTime: "03:00 PM",
      roomNumber: "101",
      buildingName: "Science Block",
    },
  ];

  // Initial Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setRequests(DUMMY_REQUESTS);
        setFaculty(DUMMY_FACULTY);
        setAllMessages(DUMMY_MESSAGES);
      } catch (err) {
        console.error("Failed to fetch data", err);
        showNotification("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isLoaded]);

  // Derived Chats based on User
  const chats: ChatSession[] = React.useMemo(() => {
    if (!user) return [];

    const userMessages = allMessages.filter(
      (m) => m.senderId === user.id || m.receiverId === user.id
    );

    // Group by "Partner"
    const groups: { [key: string]: ChatMessage[] } = {};
    userMessages.forEach((msg) => {
      const partnerId =
        msg.senderId === user.id ? msg.receiverId : msg.senderId;
      if (!groups[partnerId]) groups[partnerId] = [];
      groups[partnerId].push(msg);
    });

    return Object.keys(groups)
      .map((partnerId) => {
        const msgs = groups[partnerId].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const lastMsg = msgs[msgs.length - 1];

        // Find Partner Name (Simple lookup or from message)
        // In a real app we'd look up user DB. Here we try to infer.
        let partnerName = "Unknown User";
        const partnerMsg = msgs.find((m) => m.senderId === partnerId);
        if (partnerMsg) partnerName = partnerMsg.senderName;
        else if (partnerId === "std1") partnerName = "Alex Johnson"; // Fallback
        else if (partnerId === "fac1") partnerName = "Dr. Sarah Smith";

        return {
          contactId: partnerId,
          contactName: partnerName,
          lastMessage: lastMsg.text,
          lastMessageTime: lastMsg.timestamp,
          unreadCount: msgs.filter((m) => m.receiverId === user.id && !m.isRead)
            .length,
          messages: msgs,
          online: true, // Mock
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );
  }, [user, allMessages]);

  const addRequest = async (request: MeetingRequest) => {
    // ... same implementation ...
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRequests((prev) => [request, ...prev]);
      showNotification("Request sent successfully", "success");
    } catch (err) {
      showNotification("Failed to send request", "error");
      throw err;
    }
  };

  const updateRequestStatus = async (id: string, status: RequestStatus) => {
    // ... same implementation ...
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      showNotification("Status updated", "success");
    } catch (err) {
      showNotification("Failed to update status", "error");
    }
  };

  const sendMessage = (
    contactId: string,
    text: string,
    senderId: string,
    senderName: string,
    attachment?: ChatMessage["attachment"]
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      senderName,
      receiverId: contactId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachment,
    };
    setAllMessages((prev) => [...prev, newMessage]);
  };

  const markChatRead = (contactId: string) => {
    if (!user) return;
    setAllMessages((prev) =>
      prev.map((m) =>
        m.senderId === contactId && m.receiverId === user.id && !m.isRead
          ? { ...m, isRead: true }
          : m
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        faculty,
        chats,
        addRequest,
        updateRequestStatus,
        sendMessage,
        markChatRead,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
