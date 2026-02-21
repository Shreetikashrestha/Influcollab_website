"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { InfluencerUpdateForm } from './InfluencerUpdateForm';
import { BrandUpdateForm } from './BrandUpdateForm';

export default function UpdateUserForm({ user, profile, onComplete }: { user: any, profile?: any, onComplete?: () => void }) {
    const { user: authUser } = useAuth();
    const targetUser = user || authUser;

    const handleComplete = () => {
        if (onComplete) {
            onComplete();
        } else {
            window.location.reload(); // Simple reload to refresh data if not handled by parent
        }
    };

    if (targetUser?.isInfluencer) {
        return <InfluencerUpdateForm user={targetUser} profile={profile} onComplete={handleComplete} />;
    }

    return <BrandUpdateForm user={targetUser} profile={profile} onComplete={handleComplete} />;
}