"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleUpdateUserProfile } from "@/lib/actions/auth-action";
import { z } from "zod";
import { UserCircle, Camera, Instagram, Twitter, Youtube, Globe, Facebook } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
    fullName: z.string().min(2, { message: "Minimum 2 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    bio: z.string().optional(),
    socialChannels: z.object({
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
        youtube: z.string().optional(),
        twitter: z.string().optional(),
        website: z.string().optional(),
    }).optional(),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
})

export type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UpdateUserForm({ user }: { user: any }) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
        useForm<UpdateUserData>({
            resolver: zodResolver(updateUserSchema),
            defaultValues: {
                fullName: user?.fullName || '',
                email: user?.email || '',
                bio: user?.bio || '',
                socialChannels: {
                    instagram: user?.socialChannels?.instagram || '',
                    tiktok: user?.socialChannels?.tiktok || '',
                    youtube: user?.socialChannels?.youtube || '',
                    twitter: user?.socialChannels?.twitter || '',
                    website: user?.socialChannels?.website || '',
                }
            }
        });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: UpdateUserData) => {
        setError(null);
        try {
            const formData = new FormData();
            formData.append('fullName', data.fullName);
            formData.append('email', data.email);
            formData.append('bio', data.bio || '');

            if (data.socialChannels) {
                formData.append('socialChannels', JSON.stringify(data.socialChannels));
            }

            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await handleUpdateUserProfile(formData);
            if (!response.success) {
                throw new Error(response.message || 'Update profile failed');
            }

            handleDismissImage();
            toast.success('Profile updated successfully');
        } catch (error: Error | any) {
            toast.error(error.message || 'Profile update failed');
            setError(error.message || 'Profile update failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                {/* Profile Image Section */}
                <div className="flex flex-col items-center pb-8 border-b border-gray-50">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md relative">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : user?.profilePicture ? (
                                <img src={process.env.NEXT_PUBLIC_API_BASE_URL + user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <UserCircle className="w-20 h-20" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                            <Camera className="w-5 h-5" />
                            <Controller
                                name="image"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                        accept="image/*"
                                    />
                                )}
                            />
                        </label>
                    </div>
                    {errors.image && <p className="text-sm text-red-600 mt-2">{errors.image.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input
                            {...register("fullName")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            {...register("email")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-blue-600" /> Social Channels
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Instagram className="w-5 h-5 text-pink-600 mr-2" />
                            <input
                                {...register("socialChannels.instagram")}
                                placeholder="Instagram Profile URL"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                            <input
                                {...register("socialChannels.twitter")}
                                placeholder="Twitter Profile URL"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <Youtube className="w-5 h-5 text-red-600 mr-2" />
                            <input
                                {...register("socialChannels.youtube")}
                                placeholder="YouTube Channel URL"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <Globe className="w-5 h-5 text-gray-600 mr-2" />
                            <input
                                {...register("socialChannels.website")}
                                placeholder="Personal Website"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}