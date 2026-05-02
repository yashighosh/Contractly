import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return { user, token, isAuthenticated, login, logout: handleLogout };
}
