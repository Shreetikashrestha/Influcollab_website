import axiosInstance from './axios';
import { API } from './endpoints';

export const createPaymentIntent = async (campaignId: string, amount: number) => {
    const response = await axiosInstance.post('/payments/create-intent', { campaignId, amount });
    return response.data;
};

export const fetchTransactions = async () => {
    try {
        const response = await axiosInstance.get('/api/payments');
        return response.data;
    } catch (error: any) {
        console.error('fetchTransactions API error:', error);
        
        // Return a structured error response
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Cannot reach server')) {
            return {
                success: false,
                message: 'Cannot connect to server. Please ensure the backend is running.',
                transactions: []
            };
        }
        
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'Unauthorized. Please login as admin.',
                transactions: []
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                message: 'Access denied. Admin privileges required.',
                transactions: []
            };
        }
        
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to fetch transactions",
            transactions: []
        };
    }
};

export const fetchTransactionStats = async () => {
    try {
        const response = await axiosInstance.get('/payments/stats');
        return response.data;
    } catch (error: any) {
        console.error('fetchTransactionStats API error:', error);
        
        // Return a structured error response
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Cannot reach server')) {
            return {
                success: false,
                message: 'Cannot connect to server. Please ensure the backend is running.',
                stats: { totalRevenue: 0, totalVolume: 0 }
            };
        }
        
        if (error.response?.status === 404) {
            return {
                success: false,
                message: 'Payment stats endpoint not found. Feature may not be implemented yet.',
                stats: { totalRevenue: 0, totalVolume: 0 }
            };
        }
        
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to fetch payment stats",
            stats: { totalRevenue: 0, totalVolume: 0 }
        };
    }
};

export const fetchMyTransactions = async () => {
    const response = await axiosInstance.get(API.PAYMENT.MY_TRANSACTIONS);
    return response.data;
};

export const fetchWalletBalance = async () => {
    const response = await axiosInstance.get(API.PAYMENT.BALANCE);
    return response.data;
};

export const requestPayout = async (data: { amount: number, method: string, details?: any }) => {
    const response = await axiosInstance.post(API.PAYMENT.PAYOUT, data);
    return response.data;
};
