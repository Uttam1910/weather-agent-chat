import { useAdminAuth } from './AdminAuthContext';
import AdminLoginPage from '../views/AdminLoginPage';
import { ImSpinner8 } from 'react-icons/im';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, checkingAuth } = useAdminAuth();

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-slate-300">
        <ImSpinner8 className="text-4xl text-purple-500 animate-spin" />
        <p className="text-xs font-medium">Verifying admin session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return children;
}
