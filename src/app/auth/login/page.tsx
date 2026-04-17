'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const tx = translations[lang];
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-gray-900 mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#16a34a" />
              <path d="M6 20l3-7h14l3 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="22" r="2" fill="white" />
              <circle cx="22" cy="22" r="2" fill="white" />
            </svg>
            AvtoGo
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{tx.loginWelcomeBack}</h1>
          <p className="text-gray-500 text-sm mt-1">{tx.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6">
          <Input label={tx.authEmail} type="email" placeholder={tx.authEmailPlaceholder} value={form.email} onChange={handleChange('email')} required />
          <Input label={tx.authPassword} type="password" placeholder={tx.authPasswordPlaceholder} value={form.password} onChange={handleChange('password')} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>{tx.signInTitle}</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {tx.loginNoAccount}{' '}
          <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">{tx.authSignUp}</Link>
        </p>
      </div>
    </div>
  );
}
