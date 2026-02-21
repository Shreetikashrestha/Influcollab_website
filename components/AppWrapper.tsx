"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    // Pages that should NOT have Sidebar (auth pages and admin pages)
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    const isAdminPage = pathname?.startsWith('/admin');

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <SplashScreen />
            <div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                {!isAuthPage && !isAdminPage ? (
                    <div className="min-h-screen bg-[#fcfcfd]">
                        <Sidebar />
                        {!isAuthenticated && <Navbar />}
                        <main className={`${isAuthenticated ? 'sm:ml-72' : ''} pt-0 min-h-screen`}>
                            {children}
                        </main>
                    </div>
                ) : (
                    <main className="min-h-screen">
                        {children}
                    </main>
                )}
            </div>
        </>
    );
}
