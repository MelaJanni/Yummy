import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/stores/authStore';

import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../layouts/AuthLayout';

import HomePage from '../../features/recipes/pages/HomePage';
import RecipeDetailPage from '../../features/recipes/pages/RecipeDetailPage';
import CreateRecipePage from '../../features/recipes/pages/CreateRecipePage';
import EditRecipePage from '../../features/recipes/pages/EditRecipePage';
import MyRecipesPage from '../../features/recipes/pages/MyRecipesPage';

import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage';

import ProfilePage from '../../features/auth/pages/ProfilePage';
import FavoritesPage from '../../features/favorites/pages/FavoritesPage';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../../features/admin/pages/AdminDashboard';
import AdminPendingRecipes from '../../features/admin/pages/AdminPendingRecipes';
import AdminUsersPage from '../../features/admin/pages/AdminUsersPage';
import AdminAllRecipesPage from '../../features/admin/pages/AdminAllRecipesPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recipes/:slug', element: <RecipeDetailPage /> },
      {
        path: 'recipes/new',
        element: (
          <ProtectedRoute>
            <CreateRecipePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'recipes/:id/edit',
        element: (
          <ProtectedRoute>
            <EditRecipePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-recipes',
        element: (
          <ProtectedRoute>
            <MyRecipesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'pending', element: <AdminPendingRecipes /> },
      { path: 'recipes', element: <AdminAllRecipesPage /> },
      { path: 'users', element: <AdminUsersPage /> },
    ],
  },
]);
