import axiosInstance from "./axios";
import { API } from "./endpoints";

export const createApplication = async (applicationData: any): Promise<any> => {
    try {
        const response = await axiosInstance.post(API.APPLICATION.CREATE, applicationData);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to submit application"
        );
    }
}

export const fetchMyApplications = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.APPLICATION.MY_APPLICATIONS);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch your applications"
        );
    }
}

export const fetchCampaignApplications = async (campaignId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.APPLICATION.CAMPAIGN_APPLICATIONS(campaignId));
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch campaign applications"
        );
    }
}

export const updateApplicationStatus = async (id: string, status: 'accepted' | 'rejected' | 'pending'): Promise<any> => {
    try {
        const response = await axiosInstance.patch(API.APPLICATION.UPDATE_STATUS(id), { status });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to update application status"
        );
    }
}

// Admin level API
export const adminFetchAllApplications = async (query?: { page?: number; limit?: number }): Promise<any> => {
    try {
        const params = new URLSearchParams();
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());

        const response = await axiosInstance.get(`${API.ADMIN.APPLICATIONS}?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch platform applications"
        );
    }
}

export const adminFetchAllCampaigns = async (query?: { page?: number; limit?: number; search?: string }): Promise<any> => {
    try {
        const params = new URLSearchParams();
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.search) params.append('search', query.search);

        const response = await axiosInstance.get(`${API.ADMIN.CAMPAIGNS}?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        console.error('adminFetchAllCampaigns API error:', error);
        
        // Return a structured error response
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Cannot reach server')) {
            return {
                success: false,
                message: 'Cannot connect to server. Please ensure the backend is running.',
                campaigns: [],
                total: 0
            };
        }
        
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'Unauthorized. Please login as admin.',
                campaigns: [],
                total: 0
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                message: 'Access denied. Admin privileges required.',
                campaigns: [],
                total: 0
            };
        }
        
        if (error.response?.status === 404) {
            return {
                success: false,
                message: 'Admin campaigns endpoint not found. Please check backend implementation.',
                campaigns: [],
                total: 0
            };
        }
        
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to fetch platform campaigns",
            campaigns: [],
            total: 0
        };
    }
}

export const fetchInfluencerStats = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.APPLICATION.GET_STATS);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch stats"
        );
    }
}
