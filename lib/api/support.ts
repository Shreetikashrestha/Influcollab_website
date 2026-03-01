import axios from "./axios";
import { API } from "./endpoints";

export const createSupportTicket = async (category: string, message: string) => {
    try {
        const response = await axios.post(
            API.SUPPORT.CREATE_TICKET,
            { category, message }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create support ticket"
        );
    }
};

export const getMyTickets = async () => {
    try {
        const response = await axios.get(API.SUPPORT.MY_TICKETS);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch tickets"
        );
    }
};
