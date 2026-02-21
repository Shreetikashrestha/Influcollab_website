"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, MapPin, Instagram, Youtube, Twitter, Facebook, Plus, Trash2, UserCircle } from 'lucide-react';
import { updateProfile } from '@/lib/api/profile';
import { toast } from 'react-toastify';

const influencerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    bio: z.string().max(500, "Bio must be less than 500 characters"),
    location: z.object({
        city: z.string(),
        country: z.string()
    }),
    categories: z.array(z.string()),
    socialAccounts: z.array(z.object({
        platform: z.enum(['instagram', 'tiktok', 'youtube', 'twitter', 'facebook']),
        handle: z.string(),
        followers: z.number().default(0)
    }))
});

export const InfluencerUpdateForm = ({ user, profile, onComplete }: { user: any, profile: any, onComplete: () => void }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(influencerSchema),
        defaultValues: {
            username: profile?.username || user?.email.split('@')[0],
            bio: profile?.bio || '',
            location: {
                city: profile?.location?.city || '',
                country: profile?.location?.country || ''
            },
            categories: profile?.categories || [],
            socialAccounts: profile?.socialAccounts || []
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const res = await updateProfile(data);
            if (res.success) {
                toast.success("Profile updated successfully");
                onComplete();
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Basic Information</h3>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Username</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                        <input {...register('username')} className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                    {errors.username && <p className="text-xs text-red-500">{errors.username.message as string}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Bio</label>
                    <textarea {...register('bio')} rows={4} className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" placeholder="Tell brands about your content style and audience..." />
                    {errors.bio && <p className="text-xs text-red-500">{errors.bio.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">City</label>
                        <input {...register('location.city')} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Country</label>
                        <input {...register('location.country')} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Social Presence</h3>

                {/* Simplified social accounts list for demonstration */}
                <p className="text-sm text-gray-500 italic">Advanced social account linking coming soon. For now, enter your handles.</p>

                <div className="space-y-4">
                    {['instagram', 'youtube', 'twitter'].map((platform) => (
                        <div key={platform} className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                {platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                                {platform === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                                {platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                            </div>
                            <input
                                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} handle`}
                                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:bg-gray-300"
                >
                    {isSubmitting ? 'Updating Profile...' : 'Update Influencer Profile'}
                </button>
            </div>
        </form>
    );
};
