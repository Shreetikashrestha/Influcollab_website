"use client";

import React, { useState } from 'react';
import { User, Shield, Bell, Lock, Globe, CreditCard, Users, HelpCircle, ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('account');

    const sections = [
        { id: 'account', label: 'Account Settings', icon: User, description: 'Manage your personal information and profile visibility.' },
        { id: 'security', label: 'Security & Privacy', icon: Shield, description: 'Update your password and manage two-factor authentication.' },
        { id: 'notifications', label: 'Notification Preferences', icon: Bell, description: 'Choose how and when you want to be notified.' },
        { id: 'billing', label: 'Billing & Payments', icon: CreditCard, description: 'Manage your payment methods and view billing history.' },
        { id: 'team', label: 'Team Management', icon: Users, description: 'Invite and manage team members and permissions.' },
        { id: 'help', label: 'Help & Support', icon: HelpCircle, description: 'Get help with your account or contact our support team.' },
    ];

    const onLogout = async () => {
        await logout();
        router.push("/login");
    };

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
                                        <input type="text" defaultValue={user?.fullName} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input type="email" defaultValue={user?.email} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Timezone</label>
                                    <select className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium appearance-none">
                                        <option>UTC (Coordinated Universal Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                        <option>PST (Pacific Standard Time)</option>
                                    </select>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                        Save Account Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                {[
                                    { label: 'Email Notifications', desc: 'Receive daily digests and important account alerts via email.' },
                                    { label: 'Push Notifications', desc: 'Real-time alerts for messages and campaign status in your browser.' },
                                    { label: 'Marketplace Updates', desc: 'Stay informed about new campaigns and high-engaging influencers.' },
                                    { label: 'Chat Messages', desc: 'Instant alerts when you receive a message from a collaborator.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
                                        <div className="max-w-[70%]">
                                            <h4 className="font-bold text-gray-900 mb-1">{item.label}</h4>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Placeholder for other sections */}
                        {(activeSection === 'security' || activeSection === 'billing' || activeSection === 'team' || activeSection === 'help') && (
                            <div className="flex flex-col items-center justify-center h-[400px] text-center">
                                {(() => {
                                    const section = sections.find(s => s.id === activeSection);
                                    if (!section) return null;
                                    const Icon = section.icon;
                                    return <Icon className="w-16 h-16 text-gray-100 mb-4" />;
                                })()}
                                <h3 className="text-xl font-bold text-gray-400">Section Under Development</h3>
                                <p className="text-gray-400 text-sm max-w-xs">We're working hard to bring you the best security and management tools.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

