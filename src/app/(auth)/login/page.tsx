'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('citizen@civic.gov');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'CITIZEN' | 'AUTHORITY'>('CITIZEN');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        if (role === 'AUTHORITY') {
          router.push('/authority/dashboard');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (targetRole: 'CITIZEN' | 'AUTHORITY') => {
    const demoEmail = targetRole === 'AUTHORITY' ? 'authority@civic.gov' : 'citizen@civic.gov';
    setLoading(true);
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: demoEmail, password: 'password123', role: targetRole }),
    });

    if (targetRole === 'AUTHORITY') {
      router.push('/authority/dashboard');
    } else {
      router.push('/dashboard');
    }
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-600 text-white font-black text-2xl shadow-xs">
          S
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          SANKALP Login Portal
        </h1>
        <p className="text-xs text-slate-600">
          Citizen to Authority Civic Action Platform
        </p>
      </div>

      {/* Quick Demo Login Cards */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 space-y-3 shadow-md">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
          Hackathon Quick One-Click Demo Access
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => quickLogin('CITIZEN')}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left space-y-1 transition-colors"
          >
            <div className="font-bold text-xs text-white flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Citizen Demo
            </div>
            <div className="text-[10px] text-slate-400">Report & track complaints</div>
          </button>

          <button
            onClick={() => quickLogin('AUTHORITY')}
            className="p-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 rounded text-left space-y-1 transition-colors"
          >
            <div className="font-bold text-xs text-emerald-300 flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Authority Demo
            </div>
            <div className="text-[10px] text-emerald-400">Manage queue & upload proof</div>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRole('CITIZEN');
                setEmail('citizen@civic.gov');
              }}
              className={`py-2 text-xs font-bold rounded border ${
                role === 'CITIZEN' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              Citizen Account
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('AUTHORITY');
                setEmail('authority@civic.gov');
              }}
              className={`py-2 text-xs font-bold rounded border ${
                role === 'AUTHORITY' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              Authority Officer
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded transition-colors flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
