import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation.tsx';
import { Dashboard } from './pages/Dashboard';
import { Tools } from './pages/Tools';
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

// function PrivateRoute({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();
//
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//
//   return user ? <>{children}</> : <Navigate to="/" />;
// }

function AppContent() {
  const { user } = useAuth();
  const [isNavOpen, setIsNavOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <div className="flex">
          <Navigation onToggle={(open) => setIsNavOpen(open)} />
          <main className={`flex-1 transition-all duration-300 ${isNavOpen ? 'md:ml-64' : 'md:ml-20'}`}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tools" element={<Tools />} />
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
      <AuthProvider>
        <ToolProvider>
          <AppContent />
        </ToolProvider>
      </AuthProvider>
    </Router>
  );
}