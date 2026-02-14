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

    // Pages that should NOT have Sidebar (auth pages)
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

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
                {!isAuthPage ? (
                    <div className="min-h-screen bg-[#fcfcfd]">
                        <Sidebar />
                        {/* Only show Navbar if not logged in or on public pages? 
                            Actually, the new design uses Sidebar + Integrated Header.
                        */}
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
