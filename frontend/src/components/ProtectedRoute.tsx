'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { api } from '@/lib/api';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // Skip auth check for login page
      if (pathname === '/login') {
        setLoading(false);
        return;
      }

      try {
        // Check if token exists
        const token = localStorage.getItem('ei_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Demo mode: If using demo token, use mock user
        if (token === 'demo-token-12345') {
          setUser({
            id: 'demo-user-1',
            email: 'admin@example.com',
            companyId: 'demo-company-1',
            role: 'owner',
          });
          setLoading(false);
          return;
        }

        // Try to verify token with backend
        const { user } = await api.getMe();
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        // If backend fails, check if we have a demo token
        const token = localStorage.getItem('ei_token');
        if (token === 'demo-token-12345') {
          setUser({
            id: 'demo-user-1',
            email: 'admin@example.com',
            companyId: 'demo-company-1',
            role: 'owner',
          });
          setLoading(false);
          return;
        }
        // Otherwise redirect to login
        localStorage.removeItem('ei_token');
        router.push('/login');
      }
    }

    checkAuth();
  }, [pathname, router, setUser]);

  // Show loading state
  if (loading && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-accent-blue border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page and authenticated, redirect to dashboard
  if (pathname === '/login' && isAuthenticated) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
}
