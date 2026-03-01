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
    niches: z.array(z.string()),
    socialAccounts: z.array(z.object({
        platform: z.enum(['instagram', 'tiktok', 'youtube', 'twitter', 'facebook']),
        handle: z.string(),
        followers: z.number().default(0),
        engagementRate: z.number().default(0)
    }))
});

const CATEGORY_OPTIONS = [
    'Fashion', 'Beauty', 'Lifestyle', 'Travel', 'Food', 'Fitness', 
    'Technology', 'Gaming', 'Music', 'Art', 'Photography', 'Business'
];

const NICHE_OPTIONS = [
    'Sustainable Fashion', 'Luxury Beauty', 'Budget Travel', 'Vegan Food',
    'Home Workout', 'Tech Reviews', 'Mobile Gaming', 'Digital Art',
    'Street Photography', 'Entrepreneurship', 'Wellness', 'Parenting'
];

export const InfluencerUpdateForm = ({ user, profile, onComplete }: { user: any, profile: any, onComplete: () => void }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(profile?.categories || []);
    const [selectedNiches, setSelectedNiches] = useState<string[]>(profile?.niches || []);
    const [socialAccounts, setSocialAccounts] = useState(profile?.socialAccounts || []);
    const [audienceDemographics, setAudienceDemographics] = useState(profile?.audienceDemographics || [
        { label: 'Female (18-24)', percentage: 0 },
        { label: 'Female (25-34)', percentage: 0 },
        { label: 'Male (18-24)', percentage: 0 },
        { label: 'Male (25-34)', percentage: 0 },
        { label: 'Others', percentage: 0 }
    ]);

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
            niches: profile?.niches || [],
            socialAccounts: profile?.socialAccounts || []
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const submitData = {
                ...data,
                categories: selectedCategories,
                niches: selectedNiches,
                socialAccounts: socialAccounts,
                audienceDemographics: audienceDemographics
            };
            const res = await updateProfile(submitData);
            if (res.success) {
                toast.success("Profile updated successfully");
                onComplete();
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleNiche = (niche: string) => {
        setSelectedNiches(prev => 
            prev.includes(niche) 
                ? prev.filter(n => n !== niche)
                : [...prev, niche]
        );
    };

    const addSocialAccount = () => {
        setSocialAccounts([...socialAccounts, { platform: 'instagram', handle: '', followers: 0, engagementRate: 0 }]);
    };

    const removeSocialAccount = (index: number) => {
        setSocialAccounts(socialAccounts.filter((_: any, i: number) => i !== index));
    };

    const updateSocialAccount = (index: number, field: string, value: any) => {
        const updated = [...socialAccounts];
        updated[index] = { ...updated[index], [field]: value };
        setSocialAccounts(updated);
    };

    const updateDemographic = (index: number, percentage: number) => {
        const updated = [...audienceDemographics];
        updated[index] = { ...updated[index], percentage };
        setAudienceDemographics(updated);
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

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => toggleCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    selectedCategories.includes(category)
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">Select all categories that apply to your content</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Niches</label>
                    <div className="flex flex-wrap gap-2">
                        {NICHE_OPTIONS.map((niche) => (
                            <button
                                key={niche}
                                type="button"
                                onClick={() => toggleNiche(niche)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    selectedNiches.includes(niche)
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {niche}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">Select specific niches within your categories</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Social Accounts</h3>
                    <button
                        type="button"
                        onClick={addSocialAccount}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Account
                    </button>
                </div>

                {socialAccounts.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-8">No social accounts added yet. Click "Add Account" to get started.</p>
                ) : (
                    <div className="space-y-4">
                        {socialAccounts.map((account: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-700">Account {index + 1}</label>
                                    <button
                                        type="button"
                                        onClick={() => removeSocialAccount(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Platform</label>
                                        <select
                                            value={account.platform}
                                            onChange={(e) => updateSocialAccount(index, 'platform', e.target.value)}
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm"
                                        >
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="twitter">Twitter</option>
                                            <option value="facebook">Facebook</option>
                                        </select>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Handle</label>
                                        <input
                                            type="text"
                                            value={account.handle}
                                            onChange={(e) => updateSocialAccount(index, 'handle', e.target.value)}
                                            placeholder="@username"
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Followers (Reach)</label>
                                        <input
                                            type="number"
                                            value={account.followers}
                                            onChange={(e) => updateSocialAccount(index, 'followers', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Engagement Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={account.engagementRate}
                                            onChange={(e) => updateSocialAccount(index, 'engagementRate', parseFloat(e.target.value) || 0)}
                                            placeholder="0.0"
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Audience Demographics</h3>
                <p className="text-sm text-gray-500">Enter the percentage breakdown of your audience by demographics. Total should equal 100%.</p>
                
                <div className="space-y-4">
                    {audienceDemographics.map((demo: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                            <label className="text-sm font-bold text-gray-700 w-32">{demo.label}</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={demo.percentage}
                                onChange={(e) => updateDemographic(index, parseInt(e.target.value) || 0)}
                                className="w-24 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm"
                            />
                            <span className="text-sm font-bold text-gray-600">%</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${demo.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <p className="text-xs text-gray-400">
                    Total: {audienceDemographics.reduce((sum: number, d: any) => sum + d.percentage, 0)}%
                    {audienceDemographics.reduce((sum: number, d: any) => sum + d.percentage, 0) !== 100 && (
                        <span className="text-orange-500 ml-2">(Should be 100%)</span>
                    )}
                </p>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:bg-gray-300"
                >
                    {isSubmitting ? 'Updating...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
};
