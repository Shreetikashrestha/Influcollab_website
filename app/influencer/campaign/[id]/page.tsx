import { handleFetchCampaignDetails, handleJoinCampaign } from "@/lib/actions/campaign-action";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import {
    Calendar,
    MapPin,
    Users,
    Briefcase,
    CheckCircle,
    ArrowLeft,
    Banknote,
    Tag,
    ChevronRight,
    Megaphone,
    Building2,
    ShieldCheck,
    Clock
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ApplicationForm from "./_components/ApplicationForm";

export default async function InfluencerCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const campaignRes = (await handleFetchCampaignDetails(id)) as any;
    const userRes = (await handleWhoAmI()) as any;

    if (!campaignRes.success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <Megaphone className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Campaign Not Found</h2>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">{campaignRes.message || "We couldn't retrieve the details for this campaign."}</p>
                <Link
                    href="/influencer"
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
            </div>
        );
    }

    const campaign = campaignRes.data;
    const user = userRes?.data;
    const alreadyApplied = campaign.applicants?.some((app: any) => app.user === user?._id);

    return (
        <div className="bg-[#fcfcfd] min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
                {campaign.image ? (
                    <>
                        <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfd] via-slate-900/40 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <Megaphone className="w-20 h-20 text-slate-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfd] via-transparent to-transparent" />
                    </div>
                )}

                <div className="absolute top-8 left-8">
                    <Link
                        href="/influencer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all shadow-xl"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-6xl mx-auto px-8 -mt-32 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-purple-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                                    {campaign.category || "General"}
                                </span>
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-green-100 italic">
                                    Verified Choice
                                </span>
                            </div>

                            <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {campaign.title}
                            </h1>

                            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Brand</p>
                                    <p className="text-lg font-bold text-slate-800 tracking-tight">{campaign.brandName || "Premium Partner"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Banknote className="w-3 h-3" /> Reward
                                    </p>
                                    <p className="text-lg font-black text-green-600">NPR {campaign.budget || campaign.budgetRange || "Flexible"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Deadline
                                    </p>
                                    <p className="text-lg font-bold text-slate-800">{new Date(campaign.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3" /> Location
                                    </p>
                                    <p className="text-lg font-bold text-slate-800">{campaign.location || "Remote"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Users className="w-3 h-3" /> Applicants
                                    </p>
                                    <p className="text-lg font-bold text-slate-800">{campaign.applicants?.length || 0}</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-slate-50">
                                <section>
                                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                        Campaign Overview
                                    </h3>
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                        {campaign.description}
                                    </p>
                                </section>

                                {campaign.requirements && (
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                                            Requirements
                                        </h3>
                                        <ul className="space-y-3">
                                            {(Array.isArray(campaign.requirements)
                                                ? campaign.requirements
                                                : (campaign.requirements || "").split('\n')
                                            ).filter((r: string) => r && r.trim()).map((req: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-green-100 hover:bg-green-50/30 transition-all">
                                                    <div className="mt-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                                    </div>
                                                    <span className="text-slate-600 font-bold text-sm tracking-tight leading-tight">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Sidebar */}
                    <div className="space-y-8">
                        <ApplicationForm campaignId={id} alreadyApplied={alreadyApplied} />

                        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <div className="mt-2 space-y-5">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Time Left
                                    </span>
                                    <span className="text-slate-800">
                                        {Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days Left
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                            <h4 className="text-lg font-black mb-4 tracking-tight">Pro Tips ⚡️</h4>
                            <ul className="space-y-4">
                                <li className="text-xs text-slate-400 leading-relaxed font-medium">
                                    • Showcase your best work in your profile.
                                </li>
                                <li className="text-xs text-slate-400 leading-relaxed font-medium">
                                    • Brands love influencers with high engagement.
                                </li>
                                <li className="text-xs text-slate-400 leading-relaxed font-medium">
                                    • Apply early to stand out from the crowd.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
