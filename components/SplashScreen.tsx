"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); // 2.5 seconds to match mobile experience

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/splashbg.jpg"
                    alt="Splash Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* Central Logo Container */}
            <div className="relative z-10 animate-in zoom-in duration-500">
                <div className="bg-white p-6 rounded-[50px] shadow-2xl flex items-center justify-center">
                    <Image
                        src="/assets/logo.png"
                        alt="Collab Logo"
                        width={120}
                        height={120}
                        priority
                        className="w-24 h-24 md:w-32 md:h-32 object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
