import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token: user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
