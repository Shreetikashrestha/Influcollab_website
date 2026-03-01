//backend route paths

export const API = {
    AUTH: {
        REGISTER: "api/auth/register",
        LOGIN: "api/auth/login",
        WHOAMI: "api/auth/whoami",
        UPDATE_PROFILE: "api/users/update",
        CHANGE_PASSWORD: "api/auth/change-password",
        LOGOUT: "api/auth/logout",
        SEARCH_MESSAGING: "api/users/search-messaging"
    },
    CAMPAIGN: {
        LIST: "api/campaigns",
        DETAILS: (id: string) => `api/campaigns/${id}`,
        CREATE: "api/campaigns",
        UPDATE: (id: string) => `api/campaigns/${id}`,
        JOIN: (id: string) => `api/campaigns/${id}/join`,
        SEARCH: "api/campaigns/search",
        BRAND_CAMPAIGNS: "api/campaigns/my",
        BRAND_STATS: "api/campaigns/brand-stats"
    },
    APPLICATION: {
        CREATE: "api/applications",
        MY_APPLICATIONS: "api/applications/my",
        CAMPAIGN_APPLICATIONS: (campaignId: string) => `api/applications/campaign/${campaignId}`,
        UPDATE_STATUS: (id: string) => `api/applications/${id}/status`,
        GET_STATS: "api/applications/stats/influencer"
    },
    MESSAGE: {
        LIST: 'api/messages/conversations',
        CHAT: (id: string) => `api/messages/conversation/${id}`,
        SEND: 'api/messages/send',
        READ: (id: string) => `api/messages/${id}/read`,
        MARK_CONVERSATION_READ: (id: string) => `api/messages/conversation/${id}/read`,
    },
    NOTIFICATION: {
        LIST: 'api/notifications',
        UNREAD: 'api/notifications/unread-count',
        READ: (id: string) => `api/notifications/${id}/read`,
        MARK_ALL_READ: 'api/notifications/mark-all-read',
        DELETE: (id: string) => `api/notifications/${id}`,
    },
    PROFILES: {
        ME: 'api/profiles/me',
        GET: (id: string) => `api/profiles/${id}`,
        UPDATE: 'api/profiles/update',
        INFLUENCERS: 'api/profiles/influencers',
    },
    ADMIN: {
        USERS: "api/users/admin/all",
        USER_BY_ID: (id: string) => `api/users/${id}`,
        CREATE_USER: "api/users/admin",
        UPDATE_USER: (id: string) => `api/users/admin/${id}`,
        DELETE_USER: (id: string) => `api/users/admin/${id}`,
        CAMPAIGNS: "api/campaigns", // Use regular campaigns endpoint for now
        APPLICATIONS: "api/applications"
    },
    REVIEW: {
        CREATE: "api/reviews",
        GET_BY_USER: (userId: string) => `api/reviews/${userId}`
    },
    PAYMENT: {
        MY_TRANSACTIONS: "api/payments/my-transactions",
        BALANCE: "api/payments/balance",
        PAYOUT: "api/payments/payout"
    },
    SUPPORT: {
        CREATE_TICKET: "api/support/tickets",
        MY_TICKETS: "api/support/tickets/my",
        ALL_TICKETS: "api/support/tickets",
        UPDATE_TICKET: (id: string) => `api/support/tickets/${id}`
    }
}