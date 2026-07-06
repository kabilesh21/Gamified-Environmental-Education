import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import AiAssistant from './components/AiAssistant';
import EcoBackground from './components/EcoBackground';
import { Menu } from 'lucide-react';

// Page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import QuizPage from './pages/QuizPage';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import EcoGarden from './pages/EcoGarden';
import RewardShop from './pages/RewardShop';
import { AnimatePresence } from 'framer-motion';

function ProtectedLayout({ sidebarOpen, setSidebarOpen }) {
  return (
    <ProtectedRoute>
      <div className="app-container">
        <EcoBackground />
        
        {/* Global floating hamburger menu button visible when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 1000,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
            title="Open Sidebar"
          >
            <Menu size={22} color="#1b4d2c" />
          </button>
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar sidebarOpen={sidebarOpen} />
          <main className="main-content" style={{
            marginLeft: sidebarOpen ? '240px' : '0px',
            padding: '24px',
            transition: 'all 0.3s ease'
          }}>
            <Outlet />
          </main>
        </div>
        <AiAssistant />
      </div>
    </ProtectedRoute>
  );
}

function AppContent() {
  const [showLoader, setShowLoader] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Collapsible sidebar state

  return (
    <Router>
      <AnimatePresence>
        {showLoader && (
          <LoadingScreen key="loader" onComplete={() => setShowLoader(false)} />
        )}
      </AnimatePresence>

      {!showLoader && (
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Core Application Layout */}
          <Route element={<ProtectedLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
            <Route path="/" element={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/quiz" element={<QuizPage />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/community" element={<Community />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/garden" element={<EcoGarden />} />
            <Route path="/shop" element={<RewardShop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
