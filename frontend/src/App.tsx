import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthProvider';
import { AestheticProvider } from '@/contexts/AestheticProvider';
import { ToastProvider } from './contexts/ToastProvider';
import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { AestheticSelectionPage } from '@/pages/AestheticSelectionPage';
import { StyleQuizPage } from '@/pages/StyleQuizPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProductsPage } from '@/pages/ProductsPage';

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

              {/* Protected routes with Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="aesthetic-selection" element={<AestheticSelectionPage />} />
                <Route path="style-quiz" element={<StyleQuizPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="products" element={<ProductsPage />} />
              </Route>

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