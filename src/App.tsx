import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from './components/MockAuth';
import { DataProvider } from './components/DataContext';
import { NotificationProvider } from './components/NotificationContext';
import { ChatView } from './components/views/ChatView';
import { useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardLayout } from './components/DashboardLayout';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { SettingsView } from './components/views/SettingsView';
import { DashboardView } from './components/views/DashboardView';
import { ComplaintsView } from './components/views/ComplaintsView';
import { UsersView } from './components/views/UsersView';
import { SuperAdminView } from './components/views/SuperAdminView';
import { LoginPage } from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/common/ToastContext';

function App() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [currentView, setCurrentView] = useState('Dashboard');
  const [showLogin, setShowLogin] = useState(false);

  if (!isLoaded) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!isSignedIn) {
    if (showLogin) {
        return <LoginPage onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'Dashboard': return <DashboardView onNavigate={setCurrentView} />;
      case 'Messages': return <ChatView />;
      case 'Complaints': return <ComplaintsView />;
      case 'Announcements': return <AnnouncementsView />;
      case 'Settings': return <SettingsView />;
      case 'Users': 
        if (user?.publicMetadata?.role !== 'admin') return <DashboardView onNavigate={setCurrentView} />;
        return <UsersView />;
      case 'Colleges':
        if (user?.publicMetadata?.role !== 'superadmin') return <DashboardView onNavigate={setCurrentView} />;
        return <SuperAdminView />;
      default: return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <SignedIn>
        <NotificationProvider>
        <DataProvider>
        <ThemeProvider>
          <ToastProvider>
            <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
                <motion.div 
                    key={currentView}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.3 }}
                >
                    {renderView()}
                </motion.div>
            </DashboardLayout>
          </ToastProvider>
        </ThemeProvider>
        </DataProvider>
        </NotificationProvider>
      </SignedIn>
      <SignedOut>
        <LandingPage onLoginClick={() => setShowLogin(true)} />
      </SignedOut>
    </>
  );
}

export default App;
