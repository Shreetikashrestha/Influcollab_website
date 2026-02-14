"use client";

import React, { useState } from 'react';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/api/axios';

interface ResetFormProps {
    token: string;
}

export const ResetForm = ({ token }: ResetFormProps) => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/reset-password', {
                token,
                newPassword: password
            }) as any;
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Password reset!</h1>
                <p className="text-gray-500 max-w-sm mb-10 leading-relaxed mx-auto">
                    Your password has been successfully updated. Redirecting you to login...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    New Password
                </label>
                <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Confirm Password
                </label>
                <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
            </button>
        </form>
    );
};
