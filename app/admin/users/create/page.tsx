"use client";

import { useState } from "react";
import { createUser } from "@/lib/api/admin";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        isInfluencer: false,
        role: "user" as "admin" | "user",
        bio: "",
        gender: "" as "" | "Male" | "Female" | "Other" | "Prefer not to say",
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Create FormData object
            const data = new FormData();
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("fullName", formData.fullName);
            data.append("isInfluencer", formData.isInfluencer.toString());
            data.append("role", formData.role);
            if (formData.bio) data.append("bio", formData.bio);
            if (formData.gender) data.append("gender", formData.gender);
            if (profilePicture) data.append("profilePicture", profilePicture);

            const response = await createUser(data) as any;

            if (response.success) {
                router.push("/admin/users");
            } else {
                setError(response.message || "Failed to create user");
            }
        } catch (err: any) {
            setError(err.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New User</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "user" })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isInfluencer}
                                onChange={(e) => setFormData({ ...formData, isInfluencer: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Is Influencer</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? "Creating..." : "Create User"}
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
