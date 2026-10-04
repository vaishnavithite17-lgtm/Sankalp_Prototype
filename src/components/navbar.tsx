'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserSession } from '@/types';
import { ShieldCheck, MapPin, PlusCircle, LayoutDashboard, Building2, LogOut, User } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setSession(data.user || null))
      .catch(() => {});
  }, [pathname]);

  const switchRole = async (targetRole: 'CITIZEN' | 'AUTHORITY') => {
    const email = targetRole === 'AUTHORITY' ? 'authority@civic.gov' : 'citizen@civic.gov';
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role: targetRole }),
    });

    if (targetRole === 'AUTHORITY') {
      router.push('/authority/dashboard');
    } else {
      router.push('/dashboard');
    }
    router.refresh();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setSession(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Branding */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded bg-emerald-600 flex items-center justify-center font-black text-white text-lg tracking-wider">
                S
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">SANKALP</span>
                <span className="ml-2 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                  CIVIC TECH
                </span>
                <p className="text-[11px] text-slate-400 leading-none">Sustainable Cities Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/feed"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/feed'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Issue Feed & Map</span>
            </Link>

            <Link
              href="/report"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/report'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Report Issue</span>
            </Link>

            {session?.role === 'AUTHORITY' ? (
              <Link
                href="/authority/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/authority')
                    ? 'bg-emerald-900/60 text-emerald-200 font-semibold border border-emerald-700/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Authority Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname === '/dashboard'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Citizen Dashboard</span>
              </Link>
            )}
          </nav>

          {/* User Session & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Role Switcher Button */}
            <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-md p-0.5">
              <button
                onClick={() => switchRole('CITIZEN')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  session?.role !== 'AUTHORITY'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Citizen View
              </button>
              <button
                onClick={() => switchRole('AUTHORITY')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  session?.role === 'AUTHORITY'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Authority View
              </button>
            </div>

            {session ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="text-right text-xs hidden sm:block">
                  <div className="font-semibold text-slate-200">{session.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {session.role === 'AUTHORITY' ? session.department || 'Authority' : 'Citizen'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / Demo</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
