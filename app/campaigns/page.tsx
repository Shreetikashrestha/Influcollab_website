
import { handleFetchCampaigns } from "@/lib/actions/campaign-action";
import CampaignCard from "@/components/CampaignCard";

export default async function CampaignsPage() {
	const response = (await handleFetchCampaigns()) as any;

	if (!response.success) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
				<p className="text-gray-600">{response.message}</p>
			</div>
		);
	}

	// Ensure campaigns is always an array
	const campaigns = Array.isArray(response.data) ? response.data : [];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Explore Campaigns</h1>
					<p className="text-gray-600">Find the perfect collaboration for your next project</p>
				</div>
			</div>

			{campaigns.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No campaigns found.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{campaigns.map((campaign: any) => (
						<CampaignCard
							key={campaign._id}
							id={campaign._id}
							title={campaign.title}
							brand={campaign.brand || campaign.createdBy?.name || ""}
							category={campaign.category}
							reward={campaign.reward || campaign.budget || ""}
							deadline={campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('en-GB') : ""}
							location={campaign.location || "Remote"}
							applicants={campaign.applicants?.length || 0}
							description={campaign.description}
							image={campaign.image}
						/>
					))}
				</div>
			)}
		</div>
	);
}
