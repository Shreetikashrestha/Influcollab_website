import axiosInstance from "./axios";
import { API } from "./endpoints";

export const fetchCampaigns = async () => {
    try {
        const response = await axiosInstance.get(API.CAMPAIGN.LIST);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch campaigns"
        );
    }
}

export const fetchCampaignDetails = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.CAMPAIGN.DETAILS(id));
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch campaign details"
        );
    }
}

export const createCampaign = async (campaignData: any) => {
    try {
        const response = await axiosInstance.post(API.CAMPAIGN.CREATE, campaignData);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to create campaign"
        );
    }
}

export const joinCampaign = async (id: string, message?: string) => {
    try {
        const response = await axiosInstance.post(API.CAMPAIGN.JOIN(id), { message });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to join campaign"
        );
    }
}

export const fetchBrandCampaigns = async () => {
    try {
        const response = await axiosInstance.get(API.CAMPAIGN.BRAND_CAMPAIGNS);
        // Backend returns { success, data: [] }, we normalize it to { success, campaigns: [] }
        const raw: any = response.data;
        return {
            success: raw.success,
            campaigns: raw.data || raw.campaigns || [],
        };
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch brand campaigns"
        );
    }
}

export const fetchBrandStats = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.CAMPAIGN.BRAND_STATS);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch brand stats"
        );
    }
}


export const updateCampaign = async (id: string, campaignData: any) => {
    try {
        const response = await axiosInstance.patch(API.CAMPAIGN.UPDATE(id), campaignData);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to update campaign"
        );
    }
}
