'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-gray-900 mb-6" style={{fontFamily: 'var(--font-display)'}}>
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-label="AvtoGo">
              <rect width="32" height="32" rx="8" fill="#166534" />
              <path d="M6 20l3-7h14l3 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="22" r="2" fill="white" />
              <circle cx="22" cy="22" r="2" fill="white" />
              <path d="M7 16h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            AvtoGo
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1.5">Sign in to your account to continue</p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange('password')}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign in
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-green-700 hover:text-green-800 font-semibold">Create one free</Link>
        </p>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
          <Shield size={12} />
          <span>Your data is secure and never shared</span>
        </div>

      </div>
    </div>
  );
}
