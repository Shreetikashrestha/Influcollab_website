"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchMyProfile } from '@/lib/api/profile';
import { fetchBrandStats, fetchBrandCampaigns } from '@/lib/api/campaign';
import { InfluencerProfileView } from './_components/InfluencerProfileView';
import { BrandProfileView } from './_components/BrandProfileView';
import { AdminProfileView } from './_components/AdminProfileView';
import UpdateUserForm from './_components/UpdateForm';
import { toast } from 'react-toastify';
import { useSocket } from '@/context/SocketContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [brandStats, setBrandStats] = useState<any>(null);
    const [campaigns, setCampaigns] = useState<any[]>([]);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await fetchMyProfile();
            if (data.success) {
                setProfile(data.profile);
            }

            // If user is a brand, also load stats and campaigns
            if (user && !user.isInfluencer && user.role !== 'admin') {
                try {
                    const [statsRes, campaignsRes] = await Promise.all([
                        fetchBrandStats(),
                        fetchBrandCampaigns()
                    ]);
                    if (statsRes.success) setBrandStats(statsRes.data);
                    if (campaignsRes.success) setCampaigns(campaignsRes.campaigns || []);
                } catch (err) {
                    console.error('Failed to load brand data:', err);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Profile</h1>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700"
                    >
                        Back to View
                    </button>
                </div>
                <UpdateUserForm
                    user={user}
                    profile={profile}
                    onComplete={() => {
                        setIsEditing(false);
                        loadProfile();
                    }}
                />
            </div>
        );
    }

    if (user?.role === 'admin') {
        return <AdminProfileView user={user} onEdit={() => setIsEditing(true)} />;
    }

    if (user?.isInfluencer) {
        return <InfluencerProfileView user={user} profile={profile} onEdit={() => setIsEditing(true)} onUpdate={loadProfile} />;
    }

    return <BrandProfileView user={user} profile={profile} onEdit={() => setIsEditing(true)} brandStats={brandStats} campaigns={campaigns} />;
}

