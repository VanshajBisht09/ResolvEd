import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { LogOut } from 'lucide-react';

// Mock User Context
const UserContext = createContext<any>(null);

export const useUser = () => useContext(UserContext);

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return user ? <>{children}</> : null;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return !user ? <>{children}</> : null;
};

export const SignInButton = ({ children, mode, role }: { mode?: string, role?: 'student' | 'teacher' | 'admin' | 'superadmin', children: React.ReactNode }) => {
  const { signIn } = useUser();
  return <div onClick={() => signIn(role)}>{children}</div>;
};

export const UserButton = () => {
  const { signOut } = useUser();
    return (
        <Button 
            variant="outlined" 
            color="inherit" 
            size="small" 
            onClick={signOut}
            startIcon={<LogOut size={16} />}
            sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                color: 'text.secondary',
                borderColor: 'divider',
                width: '100%',
                justifyContent: 'flex-start',
                px: 2,
                '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'error.main',
                    borderColor: 'error.main'
                }
            }}
        >
            Sign Out
        </Button>
    )
}

export const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
     // Check if previously signed in (mock persistence)
     const stored = localStorage.getItem('mock_user');
     if(stored) setUser(JSON.parse(stored));
  }, []);

  const signIn = (role: 'student' | 'teacher' | 'admin' | 'superadmin' = 'student') => {
    const mockUsers = {
      student: {
        id: 'std1',
        fullName: 'Alex Johnson',
        firstName: 'Alex',
        primaryEmailAddress: { emailAddress: 'alex@university.edu' },
        publicMetadata: { role: 'student' }
      },
      teacher: {
        id: 'fac1',
        fullName: 'Dr. Sarah Smith',
        firstName: 'Sarah',
        primaryEmailAddress: { emailAddress: 'sarah.smith@university.edu' },
        publicMetadata: { role: 'faculty' } // Note: DataContext uses 'faculty' role string, updated here for consistency if needed, though role is usually 'teacher' in this object keys. Let's keep role proper.
      },
      admin: {
        id: 'user_admin_123',
        fullName: 'Admin User',
        firstName: 'Admin',
        primaryEmailAddress: { emailAddress: 'admin@university.edu' },
        publicMetadata: { role: 'admin' }
      },
      superadmin: {
        id: 'super_admin_001',
        fullName: 'Super Admin',
        firstName: 'System',
        primaryEmailAddress: { emailAddress: 'super@resolved.com' },
        publicMetadata: { role: 'superadmin' }
      }
    };
    
    // @ts-ignore
    const user = mockUsers[role];
    setUser(user);
    localStorage.setItem('mock_user', JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  return (
    <UserContext.Provider value={{ isLoaded: true, isSignedIn: !!user, user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
