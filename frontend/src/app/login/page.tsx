'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Demo mode: Skip API call and use mock user
      if (email === 'admin@example.com' && password === 'password') {
        const mockUser = {
          id: 'demo-user-1',
          email: 'admin@example.com',
          name: 'Demo Admin',
          role: 'admin' as const,
          companyId: 'demo-company-1',
        };
        
        // Store mock token
        localStorage.setItem('ei_token', 'demo-token-12345');
        
        // Update auth store
        setUser(mockUser);
        
        // Redirect to dashboard
        router.push('/');
        return;
      }

      // Try real API if not demo credentials
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('ei_token', data.token);
      }
      
      // Update auth store
      setUser(data.user);
      
      // Redirect to dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Veridion</h1>
          <p className="text-sm text-text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/40 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.4)] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/40 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.4)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-accent-blue hover:bg-accent-blue/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          <p>Demo credentials:</p>
          <p className="mt-1 font-mono text-xs">
            Email: admin@example.com<br />
            Password: password
          </p>
        </div>
      </div>
    </div>
  );
}
