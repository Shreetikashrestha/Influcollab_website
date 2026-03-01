"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { User, ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateUserProfile } from '@/lib/api/auth';
import { toast } from 'react-toastify';

function SettingsPageContent() {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeSection, setActiveSection] = useState('account');
    const [loading, setLoading] = useState(false);
    
    // Account settings state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    
    // Notification preferences state
    const [notificationPrefs, setNotificationPrefs] = useState({
        emailNotifications: true,
        pushNotifications: true,
        marketplaceUpdates: true,
        chatMessages: true
    });

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // Handle section query parameter
    useEffect(() => {
        const section = searchParams.get('section');
        if (section && ['account'].includes(section)) {
            setActiveSection(section);
        }
    }, [searchParams]);

    const sections = [
        { id: 'account', label: 'Account Settings', icon: User, description: 'Manage your personal information.' },
    ];

    const onLogout = async () => {
        await logout();
        router.push("/login");
    };

    const handleSaveAccount = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            
            const response: any = await updateUserProfile(formData);
            if (response.success) {
                toast.success('Account settings updated successfully!');
                await refreshUser();
            } else {
                toast.error(response.message || 'Failed to update settings');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationToggle = (key: keyof typeof notificationPrefs) => {
        setNotificationPrefs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        
        const newPrefs = {
            ...notificationPrefs,
            [key]: !notificationPrefs[key]
        };
        localStorage.setItem('notificationPreferences', JSON.stringify(newPrefs));
        toast.success('Notification preference updated');
    };

    // Load notification preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) {
            try {
                setNotificationPrefs(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse notification preferences');
            }
        }
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center">
                <div className="p-2 bg-gray-900 rounded-xl mr-4">
                    <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                Settings
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center p-4 rounded-2xl transition-all ${activeSection === section.id
                                ? 'bg-white shadow-xl shadow-gray-200/50 border border-gray-100 text-blue-600 scale-[1.02]'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <section.icon className={`w-5 h-5 mr-3 ${activeSection === section.id ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className="font-bold text-sm text-left flex-1">{section.label}</span>
                            {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-2" />}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                        >
                            <LogOut className="w-5 h-5 mr-3" /> Logout Account
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 min-h-[600px] relative overflow-hidden">
                        {/* Status Header */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                {sections.find(s => s.id === activeSection)?.label}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {sections.find(s => s.id === activeSection)?.description}
                            </p>
                        </div>

                        {/* Rendering Section Content based on activeSection */}
                        {activeSection === 'account' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Timezone</label>
                                    <select 
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                                    >
                                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                                        <option value="EST">EST (Eastern Standard Time)</option>
                                        <option value="PST">PST (Pacific Standard Time)</option>
                                        <option value="Asia/Kathmandu">NPT (Nepal Time)</option>
                                    </select>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <button 
                                        onClick={handleSaveAccount}
                                        disabled={loading}
                                        className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Save Account Changes'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <SettingsPageContent />
        </Suspense>
    );
}
