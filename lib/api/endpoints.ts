//backend route paths

export const API = {
    AUTH: {
        REGISTER: "api/auth/register",
        LOGIN: "api/auth/login",
        WHOAMI: "api/auth/whoami",
        UPDATE_PROFILE: "api/user/update",
        LOGOUT: "api/auth/logout"
    },
    CAMPAIGN: {
        LIST: "api/campaigns",
        DETAILS: (id: string) => `api/campaigns/${id}`,
        CREATE: "api/campaigns/create",
        JOIN: (id: string) => `api/campaigns/${id}/join`,
        SEARCH: "api/campaigns/search",
        BRAND_CAMPAIGNS: "api/brand/campaigns"
    },
    MESSAGE: {
        LIST: "api/messages",
        CHAT: (userId: string) => `api/messages/${userId}`
    },
    BRAND: {
        PROFILE: "api/brand/profile"
    },
    COLLABORATION: {
        REQUESTS: "api/collaborations/requests",
        STATUS: "api/collaborations/status"
    },
    ADMIN: {
        USERS: "api/admin/users",
        USER_BY_ID: (id: string) => `api/admin/users/${id}`,
        CREATE_USER: "api/admin/users",
        UPDATE_USER: (id: string) => `api/admin/users/${id}`,
        DELETE_USER: (id: string) => `api/admin/users/${id}`
    },
    USER: {
        PROFILE: "api/user/profile",
        UPDATE_PROFILE: (id: string) => `api/auth/${id}`
    }
}