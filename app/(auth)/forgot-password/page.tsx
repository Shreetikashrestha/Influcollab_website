"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import axios from '@/lib/api/axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/forgot-password', { email }) as any;
            if (response.data.success) {
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Check your email</h1>
                <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
                    If this email exists, a reset link has been sent to <span className="font-bold text-gray-900">{email}</span>.
                </p>
                <Link
                    href="/login"
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                >
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-10 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Login
                </Link>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Forgot Password?</h1>
                        <p className="text-gray-400 font-medium">No worries, it happens. Enter your email and we'll send you a link to reset it.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
