import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/navigation/Navigation.tsx';
import { Dashboard } from './pages/Dashboard';
import { AllTools } from './pages/AllTools';
import { ToolPage } from './pages/tools/ToolPage';
import { History } from './pages/History';
import { Chat } from './pages/Chat';
import { Login } from './pages/Login';
import { SignUpFree } from './pages/SignUpFree';
import { SignUpTrial } from './pages/SignUpTrial';
import { Profile } from './pages/Profile';
import { Landing } from './pages/Landing';
import { Pricing } from './pages/Pricing';
import { GlobalAdmin } from './pages/admin/GlobalAdmin';
import { SchoolAdmin } from './pages/admin/SchoolAdmin';
import { TicketManagement } from './pages/admin/TicketManagement';
import { ManageTools } from './pages/admin/ManageTools';
import { NotAuthorized } from './components/admin/NotAuthorized';
import { AuthProvider } from './context/AuthContext';
import { ToolProvider } from './context/ToolContext';
import { useAuth } from './context/AuthContext';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const { user } = useAuth();
  const [isNavOpen, setIsNavOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-primary dark:text-dark-text">
      {user ? (
        <div className="flex">
          <Navigation onToggle={(open) => setIsNavOpen(open)} />
          <main className={`flex-1 transition-all duration-300 ${isNavOpen ? 'md:ml-64' : 'md:ml-20'}`}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tools" element={<AllTools />} />
              <Route path="/tools/:navigation" element={
                <ToolProvider>
                  <ToolPage />
                </ToolProvider>
              } />
              <Route path="/history" element={<History />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/admin" element={<GlobalAdmin />} />
              <Route path="/school-admin" element={<SchoolAdmin />} />
              <Route path="/tickets" element={<TicketManagement />} />
              <Route path="/manage-tools" element={<ManageTools />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          <EmailVerificationBanner />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpFree />} />
          <Route path="/signup-trial" element={<SignUpTrial />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}