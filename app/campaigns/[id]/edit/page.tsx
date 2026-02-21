"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchCampaignDetails, updateCampaign } from "@/lib/api/campaign";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditCampaignPage() {
    const router = useRouter();
    const params = useParams();
    const campaignId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [campaign, setCampaign] = useState<any>(null);

    useEffect(() => {
        if (campaignId) {
            loadCampaign();
        }
    }, [campaignId]);

    const loadCampaign = async () => {
        try {
            setLoading(true);
            console.log('Loading campaign:', campaignId);
            const res: any = await fetchCampaignDetails(campaignId);
            console.log('Campaign loaded:', res);
            if (res.success) {
                setCampaign(res.data);
            } else {
                toast.error(res.message || "Failed to load campaign");
                router.push("/brand/campaigns");
            }
        } catch (err: any) {
            console.error('Error loading campaign:', err);
            toast.error(err.message || "Failed to load campaign");
            router.push("/brand/campaigns");
        } finally {
            setLoading(false);
        }
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log('Form submitted, campaignId:', campaignId);
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);

        const rawRequirements = formData.get("requirements")?.toString() || "";
        const requirementsArray = rawRequirements.split("\n").map(r => r.trim()).filter(r => r !== "");

        const rawDeliverables = formData.get("deliverables")?.toString() || "";
        const deliverablesArray = rawDeliverables.split("\n").map(d => d.trim()).filter(d => d !== "");

        const data = {
            title: formData.get("title"),
            brandName: formData.get("brandName"),
            category: formData.get("category"),
            budgetMin: Number(formData.get("budgetMin")),
            budgetMax: Number(formData.get("budgetMax")),
            deadline: formData.get("deadline"),
            location: formData.get("location"),
            description: formData.get("description"),
            requirements: requirementsArray,
            deliverables: deliverablesArray,
            status: formData.get("status"),
        };

        console.log('Calling updateCampaign with:', campaignId, data);

        try {
            const response: any = await updateCampaign(campaignId, data);
            console.log('Update response:', response);
            if (response.success) {
                toast.success("Campaign updated successfully!");
                router.push(`/campaigns/${campaignId}`);
            } else {
                toast.error(response.message || "Failed to update campaign");
            }
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.message || "Failed to update campaign");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link
                href={`/campaigns/${campaignId}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
            >
                <ArrowLeft size={20} />
                Back to Campaign
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Campaign</h1>

            <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={campaign.title}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Summer Fashion Collaboration"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input
                            name="brandName"
                            type="text"
                            required
                            defaultValue={campaign.brandName}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Budget (NPR)</label>
                        <input
                            name="budgetMin"
                            type="number"
                            min="0"
                            required
                            defaultValue={campaign.budgetMin}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. 5000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Budget (NPR)</label>
                        <input
                            name="budgetMax"
                            type="number"
                            min="0"
                            required
                            defaultValue={campaign.budgetMax}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. 15000"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            required
                            defaultValue={campaign.category}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="Fashion">Fashion</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Food">Food</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Travel">Travel</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            name="deadline"
                            type="date"
                            required
                            defaultValue={campaign.deadline ? new Date(campaign.deadline).toISOString().split('T')[0] : ''}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            name="location"
                            type="text"
                            required
                            defaultValue={campaign.location}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Remote or City, Country"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            required
                            defaultValue={campaign.status}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        defaultValue={campaign.description}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Describe your campaign goal and what you are looking for..."
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                    <textarea
                        name="requirements"
                        rows={3}
                        defaultValue={campaign.requirements?.join("\n") || ""}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Must have 10k+ followers&#10;Active engagement rate&#10;Experience with product reviews"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (one per line)</label>
                    <textarea
                        name="deliverables"
                        rows={3}
                        defaultValue={campaign.deliverables?.join("\n") || ""}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. 3 Instagram posts&#10;2 Instagram stories&#10;1 TikTok video"
                    ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Updating..." : "Update Campaign"}
                    </button>
                    <Link
                        href={`/campaigns/${campaignId}`}
                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
