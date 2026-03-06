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
      // DEVELOPMENT BYPASS: Auto-login with test user
      if (process.env.NODE_ENV === 'development') {
        // Set a dummy token for development
        const devToken = 'dev-token-bypass';
        localStorage.setItem('ei_token', devToken);
        api.setToken(devToken);
        
        setUser({
          id: '9f3931aa-81ed-4801-b0b7-253ec0790a23',
          companyId: 'c7ebf8f6-4d27-4308-9c27-8fadf8983a1a',
          role: 'owner',
          email: 'admin@demo.com',
        });
        setLoading(false);
        return;
      }

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

        // Set token in API client
        api.setToken(token);

        // Verify token with backend
        const { user } = await api.getMe();
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('ei_token');
        api.clearToken();
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
