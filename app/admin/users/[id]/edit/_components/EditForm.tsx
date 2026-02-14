"use client";

import { useState, useEffect } from "react";
import { getUserById, updateUser } from "@/lib/api/admin";
import { useRouter } from "next/navigation";
import { Camera, UserCircle } from "lucide-react";

export default function EditUserForm({ userId }: { userId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        isInfluencer: false,
        role: "user" as "admin" | "user",
        bio: "",
        gender: "" as "" | "Male" | "Female" | "Other" | "Prefer not to say",
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId) as any;
                if (response.success) {
                    const user = response.data;
                    setFormData({
                        email: user.email || "",
                        fullName: user.fullName || "",
                        isInfluencer: !!user.isInfluencer,
                        role: user.role || "user",
                        bio: user.bio || "",
                        gender: user.gender || "",
                    });
                } else {
                    setError(response.message || "Failed to fetch user");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("fullName", formData.fullName);
            data.append("isInfluencer", formData.isInfluencer.toString());
            data.append("role", formData.role);
            if (formData.bio) data.append("bio", formData.bio);
            if (formData.gender) data.append("gender", formData.gender);
            if (profilePicture) data.append("profilePicture", profilePicture);

            const response = await updateUser(userId, data) as any;

            if (response.success) {
                router.push("/admin/users");
            } else {
                setError(response.message || "Failed to update user");
            }
        } catch (err: any) {
            setError(err.message || "Failed to update user");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading user data...</div>;

    return (
        <div className="bg-white shadow-md rounded p-6 max-w-2xl mx-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <UserCircle className="w-20 h-20" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                            <Camera className="w-5 h-5" />
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Change Profile Picture</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "user" })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isInfluencer}
                                    onChange={(e) => setFormData({ ...formData, isInfluencer: e.target.checked })}
                                    className="mr-2 h-4 w-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Is Influencer</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/admin/users")}
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
