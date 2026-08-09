import { useAdminAuth } from './AdminAuthContext';
import AdminLoginPage from '../views/AdminLoginPage';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return children;
}
