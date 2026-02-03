"use server";

import { fetchCampaigns, fetchCampaignDetails, createCampaign, joinCampaign, fetchBrandCampaigns } from "../api/campaign";
import { revalidatePath } from "next/cache";

export const handleFetchCampaigns = async () => {
    try {
        const result = (await fetchCampaigns()) as any;
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch campaigns"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to fetch campaigns"
        }
    }
}

export const handleFetchCampaignDetails = async (id: string) => {
    try {
        const result = (await fetchCampaignDetails(id)) as any;
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch campaign details"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to fetch campaign details"
        }
    }
}

export const handleCreateCampaign = async (formData: any) => {
    try {
        const result = (await createCampaign(formData)) as any;
        if (result.success) {
            revalidatePath("/campaigns");
            revalidatePath("/(dashboard)/brand");
            return {
                success: true,
                message: "Campaign created successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to create campaign"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to create campaign"
        }
    }
}

export const handleJoinCampaign = async (id: string) => {
    try {
        const result = (await joinCampaign(id)) as any;
        if (result.success) {
            revalidatePath(`/campaigns/${id}`);
            revalidatePath("/(dashboard)/influencer");
            return {
                success: true,
                message: "Joined campaign successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to join campaign"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to join campaign"
        }
    }
}

export const handleFetchBrandCampaigns = async () => {
    try {
        const result = (await fetchBrandCampaigns()) as any;
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch brand campaigns"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to fetch brand campaigns"
        }
    }
}
