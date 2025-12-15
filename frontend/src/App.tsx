import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthProvider';
import { AestheticProvider } from '@/contexts/AestheticProvider';
import { ToastProvider } from './contexts/ToastProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { AestheticSelectionPage } from '@/pages/AestheticSelectionPage';
import { StyleQuizPage } from '@/pages/StyleQuizPage';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AestheticProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aesthetic-selection"
                element={
                  <ProtectedRoute>
                    <AestheticSelectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/style-quiz"
                element={
                  <ProtectedRoute>
                    <StyleQuizPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AestheticProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;