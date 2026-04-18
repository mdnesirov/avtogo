'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { Check, Shield } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  const perks = [
    'Browse hundreds of cars across Azerbaijan',
    'List your own car and earn',
    'Free to join — no hidden fees',
  ];

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
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>Join AvtoGo</h1>
          <p className="text-gray-500 text-sm mt-1.5">Start renting or listing in minutes</p>
        </div>

        {/* Perks */}
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5 space-y-1.5">
          {perks.map(p => (
            <div key={p} className="flex items-center gap-2 text-sm text-green-800">
              <Check size={13} className="text-green-600 shrink-0" />
              <span>{p}</span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Ali Aliyev"
              value={form.fullName}
              onChange={handleChange('fullName')}
              required
            />
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
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange('password')}
              minLength={8}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create free account
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-700 hover:text-green-800 font-semibold">Sign in</Link>
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
          <Shield size={12} />
          <span>Your data is secure and never shared</span>
        </div>
      </div>
    </div>
  );
}
