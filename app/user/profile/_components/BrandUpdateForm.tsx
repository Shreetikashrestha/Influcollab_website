"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProfileWithImage } from '@/lib/api/profile';
import { toast } from 'react-toastify';
import { Building2, Globe, MapPin, Upload, X, Image } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const brandSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    industry: z.string().min(1, "Industry is required"),
    description: z.string().max(1000, "Description too long").optional().or(z.literal('')),
    website: z.string().url("Invalid URL — include https://").optional().or(z.literal('')),
    headquarters: z.object({
        city: z.string().optional().or(z.literal('')),
        country: z.string().optional().or(z.literal(''))
    }),
    socialLinks: z.object({
        instagram: z.string().url("Invalid URL").optional().or(z.literal('')),
        tiktok: z.string().url("Invalid URL").optional().or(z.literal('')),
        facebook: z.string().url("Invalid URL").optional().or(z.literal('')),
    }).optional()
});

export const BrandUpdateForm = ({ user, profile, onComplete }: { user: any, profile: any, onComplete: () => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        profile?.logo ? (profile.logo.startsWith('/uploads') ? `${BACKEND_URL}${profile.logo}` : profile.logo) : null
    );

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            companyName: profile?.companyName || user?.fullName || '',
            industry: profile?.industry || '',
            description: profile?.description || '',
            website: profile?.website || '',
            headquarters: {
                city: profile?.headquarters?.city || '',
                country: profile?.headquarters?.country || ''
            },
            socialLinks: {
                instagram: profile?.socialLinks?.instagram || '',
                tiktok: profile?.socialLinks?.tiktok || '',
                facebook: profile?.socialLinks?.facebook || '',
            }
        }
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB");
            return;
        }
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const { refreshUser } = useAuth();

    const onSubmit = async (data: any) => {
        try {
            const res = await updateProfileWithImage(data, logoFile || undefined);
            if (res.success) {
                toast.success("Brand profile updated successfully! ✅");
                await refreshUser();
                onComplete();
            } else {
                toast.error(res.message || "Update failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">

            {/* Logo Upload */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2 text-blue-600" /> Brand Logo
                </h3>
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {logoPreview ? (
                            <>
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                                <button
                                    type="button"
                                    onClick={clearLogo}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all"
                                >
                                    <X size={10} />
                                </button>
                            </>
                        ) : (
                            <Building2 className="w-8 h-8 text-gray-300" />
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2 px-5 py-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-bold text-sm hover:bg-blue-100 transition-all w-fit">
                            <Upload size={16} /> {logoPreview ? "Change Logo" : "Upload Logo"}
                        </label>
                        <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 5MB. Recommended: 400×400px</p>
                        {logoFile && <p className="text-xs text-green-600 font-medium mt-1">✓ {logoFile.name} selected</p>}
                    </div>
                </div>
            </div>

            {/* Company Details */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" /> Company Details
                </h3>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Company Name *</label>
                    <input {...register('companyName')} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                    {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Industry *</label>
                        <select {...register('industry')} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none font-medium">
                            <option value="">Select Industry</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Tech">Technology</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Food">Food & Beverage</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Health">Health & Wellness</option>
                            <option value="Travel">Travel</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.industry && <p className="text-xs text-red-500">{errors.industry.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700"><Globe size={13} className="inline mr-1" />Website</label>
                        <input {...register('website')} placeholder="https://example.com" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                        {errors.website && <p className="text-xs text-red-500">{errors.website.message as string}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Company Description</label>
                    <textarea {...register('description')} rows={5} className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all resize-none font-medium" placeholder="Describe your brand and what you look for in influencers..." />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message as string}</p>}
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center">
                    Social Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Instagram</label>
                        <input {...register('socialLinks.instagram')} placeholder="https://instagram.com/yourbrand" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                        {errors.socialLinks?.instagram && <p className="text-xs text-red-500">{errors.socialLinks.instagram.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">TikTok</label>
                        <input {...register('socialLinks.tiktok')} placeholder="https://tiktok.com/@yourbrand" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                        {errors.socialLinks?.tiktok && <p className="text-xs text-red-500">{errors.socialLinks.tiktok.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Facebook</label>
                        <input {...register('socialLinks.facebook')} placeholder="https://facebook.com/yourbrand" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                        {errors.socialLinks?.facebook && <p className="text-xs text-red-500">{errors.socialLinks.facebook.message as string}</p>}
                    </div>
                </div>
            </div>

            {/* Headquarters */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Headquarters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">City</label>
                        <input {...register('headquarters.city')} placeholder="Kathmandu" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Country</label>
                        <input {...register('headquarters.country')} placeholder="Nepal" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 justify-end pt-4">
                <button type="button" onClick={onComplete} className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save Brand Settings'}
                </button>
            </div>
        </form>
    );
};
