import { SignedIn, SignedOut, useUser } from './components/MockAuth';
import { DataProvider } from './components/DataContext';
import { NotificationProvider } from './components/NotificationContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout } from './components/DashboardLayout';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/common/ToastContext';

import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardView } from './pages/Dashboard';
import { ChatView } from './pages/Chat';
import { ComplaintsView } from './pages/Complaints';
import { AnnouncementsView } from './pages/Announcements';
import { SettingsView } from './pages/Settings';
import { UsersView } from './pages/Users';
import { SuperAdminView } from './pages/SuperAdmin';

function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <DataProvider>
             <AnimatePresence mode='wait'>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                        <LandingPage onLoginClick={() => window.location.href = '/login'} />
                    } />
                    <Route path="/login" element={
                        isSignedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onBack={() => window.location.href = '/'} />
                    } />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <SignedIn>
                            <DashboardLayout>
                                <DashboardView onNavigate={() => {}} />
                            </DashboardLayout>
                        </SignedIn>
                    } />
                     <Route path="/messages" element={
                        <SignedIn>
                            <DashboardLayout>
                                <ChatView />
                            </DashboardLayout>
                        </SignedIn>
                    } />
                     <Route path="/complaints" element={
                        <SignedIn>
                            <DashboardLayout>
                                <ComplaintsView />
                            </DashboardLayout>
                        </SignedIn>
                    } />
                     <Route path="/announcements" element={
                        <SignedIn>
                            <DashboardLayout>
                                <AnnouncementsView />
                            </DashboardLayout>
                        </SignedIn>
                    } />
                     <Route path="/settings" element={
                        <SignedIn>
                            <DashboardLayout>
                                <SettingsView />
                            </DashboardLayout>
                        </SignedIn>
                    } />
                     <Route path="/users" element={
                        <SignedIn>
                            <DashboardLayout>
                                {user?.publicMetadata?.role === 'admin' ? <UsersView /> : <Navigate to="/dashboard" />}
                            </DashboardLayout>
                        </SignedIn>
                    } />
                     <Route path="/colleges" element={
                        <SignedIn>
                            <DashboardLayout>
                                {user?.publicMetadata?.role === 'superadmin' ? <SuperAdminView /> : <Navigate to="/dashboard" />}
                            </DashboardLayout>
                        </SignedIn>
                    } />
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
             </AnimatePresence>
          </DataProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
