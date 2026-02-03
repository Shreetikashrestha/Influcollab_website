import { handleFetchCampaignDetails, handleJoinCampaign } from "@/lib/actions/campaign-action";
import { fetchWhoAmI } from "@/lib/api/auth";
import { Calendar, MapPin, Users, Briefcase, Tag, CheckCircle } from "lucide-react";

export default async function CampaignDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const campaignRes = (await handleFetchCampaignDetails(id)) as any;
    const userRes = (await fetchWhoAmI()) as any;

    if (!campaignRes.success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{campaignRes.message}</p>
            </div>
        );
    }

    const campaign = campaignRes.data;
    const user = userRes.data;
    const isBrand = user?.role === "brand";
    const alreadyApplied = campaign.applicants?.some((app: any) => app.user === user?._id);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-64 w-full bg-gray-200">
                    {campaign.image ? (
                        <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Image Available
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">
                                {campaign.category}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
                        </div>
                        {!isBrand && (
                            <form action={async () => {
                                "use server";
                                await handleJoinCampaign(id);
                            }}>
                                <button
                                    disabled={alreadyApplied}
                                    type="submit"
                                    className={`px-8 py-3 rounded-xl font-bold transition-all ${alreadyApplied
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                        }`}
                                >
                                    {alreadyApplied ? "Already Applied" : "Apply Now"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-6 border-y border-gray-50">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Deadline</p>
                                <p className="font-medium">{new Date(campaign.deadline).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Location</p>
                                <p className="font-medium">{campaign.location || "Remote"}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Applicants</p>
                                <p className="font-medium">{campaign.applicants?.length || 0} People</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                Description
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {campaign.description}
                            </p>
                        </section>

                        {campaign.requirements && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                    Requirements
                                </h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    {campaign.requirements.split('\n').map((req: string, i: number) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
