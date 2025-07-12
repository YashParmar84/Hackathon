import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SwapProvider } from './contexts/SwapContext';
import { AdminProvider } from './contexts/AdminContext';
import { ToastProvider } from './contexts/ToastContext';
import { LandingPage, AuthPage, DashboardPage, ProfilePage, RequestPage, AuthProfilePage, BrowsePage } from './pages';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { AppLayout } from './components/Layout/AppLayout';
import { AdminPage } from './components/Admin/AdminPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SwapProvider>
          <AdminProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/" 
                  element={
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  } 
                />
                
                {/* Auth routes */}
                <Route 
                  path="/auth/:mode" 
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  } 
                />
                
                {/* Auth Profile Setup - Protected but no layout */}
                <Route 
                  path="/auth/profile" 
                  element={
                      <AuthProfilePage />
                  } 
                />
                
                {/* Protected routes with navigation */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin" 
                  element={
                    <AppLayout>
                      <AdminPage />
                    </AppLayout>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ProfilePage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/request" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <RequestPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/browse" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <BrowsePage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route - redirect to landing page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AdminProvider>
        </SwapProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;