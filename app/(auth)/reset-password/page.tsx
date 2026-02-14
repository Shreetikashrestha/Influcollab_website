"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { ResetForm } from '../_components/ResetForm';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    if (!token && error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-4">Invalid Link</h1>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <Link href="/forgot-password" className="text-blue-600 font-black uppercase tracking-widest text-xs hover:underline">
                        Request a new link
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Set New Password</h1>
                        <p className="text-gray-400 font-medium text-sm px-4">Create a strong password that you haven't used before.</p>
                    </div>

                    {token && <ResetForm token={token} />}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
