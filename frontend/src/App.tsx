import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthProvider';
import { AestheticProvider } from '@/contexts/AestheticProvider';
import { MerchantProvider } from '@/contexts/MerchantProvider';
import { CartProvider } from './contexts';
import { ToastProvider } from './contexts/ToastProvider';
import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { AdminRoute } from '@/components/routes/AdminRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/auth/HomePage';
import { AestheticSelectionPage } from '@/pages/aesthetic/AestheticSelectionPage';
import { StyleQuizPage } from '@/pages/aesthetic/StyleQuizPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { ProductsPage } from '@/pages/product/ProductsPage';
import { ProductDetailsPage } from './pages/product/ProductDetailsPage';
import { CartPage } from './pages/cart/CartPage';

// Merchant Pages
import { MerchantDashboardPage } from '@/pages/merchant/MerchantDashboardPage';
import { CreateMerchantPage } from '@/pages/merchant/CreateMerchantPage';
import { ManageProductsPage } from '@/pages/product/ManageProductsPage';
import { CreateProductPage } from '@/pages/product/CreateProductPage';
import { EditProductPage } from '@/pages/product/EditProductPage';
import { ManageStaffPage } from '@/pages/merchant/ManageStaffPage';
import { MerchantSettingsPage } from '@/pages/merchant/MerchantSettingsPage';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MerchantProvider>
            <AestheticProvider>
              <CartProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected customer routes with Layout */}
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
                    <Route path="products/:id" element={<ProductDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                  </Route>

                  {/* Protected merchant routes with Layout */}
                  <Route
                    path="/merchant"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<MerchantDashboardPage />} />
                    <Route path="create" element={<CreateMerchantPage />} />
                    <Route path="products" element={<ManageProductsPage />} />
                    <Route path="products/new" element={<CreateProductPage />} />
                    <Route path="products/:id" element={<EditProductPage />} />
                    <Route path="staff" element={<ManageStaffPage />} />
                    <Route path="settings" element={<MerchantSettingsPage />} />
                  </Route>

                  {/* Protected admin routes with Layout */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <Layout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboardPage />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </CartProvider>
            </AestheticProvider>
          </MerchantProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;