import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from '@/hooks/useAdminAccess';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAccess();
  const { toast } = useToast();
  
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
         <img
          src="/logo_ema.png"
          alt="Logo"
          className="w-24 h-24 animate-blink-fade"
        />
        </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    signOut()
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;