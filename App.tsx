import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { CatalogProvider } from "./hooks/useCatalog";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ToastProvider } from "./contexts/ToastContext";
import CatalogPage from "./components/public/CatalogPage";
import LoginPage from "./components/admin/LoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import ProductManager from "./components/admin/ProductManager";
import CategoryManager from "./components/admin/CategoryManager";
import SiteSettings from "./components/admin/SiteSettings";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ToastProvider>
      <CatalogProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<CatalogPage />} />

              {/* Admin Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="settings" element={<SiteSettings />} />
              </Route>
            </Routes>
          </HashRouter>
        </AuthProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}

export default App;
