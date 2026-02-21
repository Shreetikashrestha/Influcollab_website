"use server";

import { fetchCampaigns, fetchCampaignDetails, createCampaign, joinCampaign, fetchBrandCampaigns } from "../api/campaign";
import { revalidatePath } from "next/cache";

export const handleFetchCampaigns = async () => {
    try {
        return await fetchCampaigns();
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch campaigns"
        };
    }
}

export const handleFetchCampaignDetails = async (id: string) => {
    try {
        return await fetchCampaignDetails(id);
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch campaign details"
        };
    }
}

export const handleCreateCampaign = async (formData: any) => {
    try {
        const result = (await createCampaign(formData)) as any;
        if (result.success) {
            revalidatePath("/campaigns");
            revalidatePath("/(dashboard)/brand");
        }
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to create campaign"
        };
    }
}

export const handleJoinCampaign = async (id: string, message?: string) => {
    try {
        const result = (await joinCampaign(id, message)) as any;
        if (result.success) {
            revalidatePath(`/campaigns/${id}`);
            revalidatePath("/(dashboard)/influencer");
        }
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to join campaign"
        };
    }
}

export const handleFetchBrandCampaigns = async () => {
    try {
        return await fetchBrandCampaigns();
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch brand campaigns"
        };
    }
}
