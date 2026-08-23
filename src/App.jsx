import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import DocumentsPage from './pages/DocumentsPage'

/*
 * Routing table. Three kinds of route:
 *
 *   PublicOnlyRoute — auth forms; signed-in users get sent to the dashboard.
 *   ProtectedRoute  — the real app; signed-out users get sent to login.
 *   unguarded       — /reset-password only. The recovery link creates a real
 *                     session, so PublicOnlyRoute would bounce it, and an
 *                     expired link has no session, so ProtectedRoute would
 *                     dump the user on login with no explanation. The page
 *                     handles both cases itself.
 *
 * "/" is the login page for now — it becomes the landing page later, with
 * login moving to "/login".
 */
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignUpPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
