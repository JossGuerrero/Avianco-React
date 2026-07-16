import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function StaffRoute() {
  const isStaff = useAuthStore((state) => state.isStaff);
  return isStaff ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
