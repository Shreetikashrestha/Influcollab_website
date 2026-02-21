"use client";

import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { handleJoinCampaign } from "@/lib/actions/campaign-action";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ApplicationFormProps {
    campaignId: string;
    alreadyApplied: boolean;
}

export default function ApplicationForm({ campaignId, alreadyApplied }: ApplicationFormProps) {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (alreadyApplied || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const res = await handleJoinCampaign(campaignId, message);
            if (res.success) {
                toast.success("Application successfully sent!");
                // Give the toast a moment to be seen before redirecting
                setTimeout(() => {
                    router.push("/influencer/applications");
                }, 1500);
            } else {
                toast.error(res.message || "Failed to send application");
            }
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 sticky top-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Apply Now</h3>
            </div>

            <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
                Join this campaign and collaborate with brands to create amazing content. Your profile will be reviewed by the brand.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Proposal Message (Optional)
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Briefly explain why you are a great fit for this campaign..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-[20px] p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-purple-100 outline-none min-h-[120px] transition-all"
                    ></textarea>
                </div>

                <button
                    disabled={alreadyApplied || isSubmitting}
                    type="submit"
                    className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${alreadyApplied || isSubmitting
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-auth-gradient text-white hover:scale-[1.02] active:scale-[0.98] shadow-purple-100"
                        }`}
                >
                    {isSubmitting ? (
                        <>Sending...</>
                    ) : alreadyApplied ? (
                        <>Applied Already</>
                    ) : (
                        <>Send Application <ArrowLeft className="w-4 h-4 rotate-180" /></>
                    )}
                </button>
            </form>
        </div>
    );
}
