import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import NewApplicationPage from './pages/NewApplicationPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ResumesPage from './pages/ResumesPage';
import MatchScorePage from './pages/MatchScorePage';
import GenerateResumePage from './pages/GenerateResumePage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );
  }

  return (
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* protected routes — wrapped in Layout (sidebar + nav) */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/new" element={<NewApplicationPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/match-score" element={<MatchScorePage />} />
          <Route path="/generate-resume" element={<GenerateResumePage />} />
          <Route path="/interview-prep" element={<InterviewPrepPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  );
}

export default App;