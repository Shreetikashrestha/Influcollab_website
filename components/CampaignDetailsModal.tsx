import React from 'react';

interface CampaignDetailsModalProps {
  open: boolean;
  onClose: () => void;
  campaign: {
    title: string;
    brand: string;
    description: string;
    budget: string;
    category: string;
    deadline: string;
    location: string;
    requirements: string[];
    deliverables: string[];
  } | null;
}

const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({ open, onClose, campaign }) => {
  if (!open || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-1">{campaign.title}</h2>
        <div className="text-gray-500 mb-4">{campaign.brand}</div>
        <div className="mb-4">{campaign.description}</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-400">Budget</div>
            <div className="font-semibold">{campaign.budget}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Category</div>
            <div className="font-semibold">{campaign.category}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Deadline</div>
            <div className="font-semibold">{campaign.deadline}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Location</div>
            <div className="font-semibold">{campaign.location}</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-xs text-gray-400 mb-1">Requirements</div>
          <ul className="list-disc pl-5 text-sm">
            {campaign.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-1">Deliverables</div>
          <ul className="list-disc pl-5 text-sm">
            {campaign.deliverables.map((del, i) => (
              <li key={i}>{del}</li>
            ))}
          </ul>
        </div>
        <button className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CampaignDetailsModal;
