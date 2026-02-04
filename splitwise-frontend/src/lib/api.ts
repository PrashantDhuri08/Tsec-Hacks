import axios from 'axios';
import { RegisterResponse, LoginResponse, PaymentIntentResponse, SettlementResponse, ExpenseCategory, PaymentStatus, LedgerEntry, User } from './types';

export * from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const FINTERNET_API_BASE = 'https://api.fmm.finternetlab.io/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const finternetApi = axios.create({
    baseURL: FINTERNET_API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const splitwiseApi = {
    // Auth & User
    register: async (email: string, password: string) => {
        const response = await api.post<RegisterResponse>(`/auth/register`, { email, password });
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post<LoginResponse>(`/auth/login`, { email, password });
        return response.data;
    },

    getUserWallet: async (userId: number) => {
        const response = await api.get<{ wallet_balance: number }>(`/users/${userId}/wallet`);
        return response.data;
    },

    // 1. Create Event
    createEvent: async (title: string, organizerId: number) => {
        const response = await api.post<{ id: number; title: string; admin_user_id: number }>(`/events`, null, {
            params: { title, organizer_id: organizerId },
        });
        return response.data;
    },

    // 2. Participants
    inviteParticipant: async (eventId: string | number, email: string, adminId: number) => {
        const response = await api.post<{ status: string }>(`/events/${eventId}/invite`, null, {
            params: { email, admin_id: adminId },
        });
        return response.data;
    },

    voteOnParticipant: async (eventId: string | number, candidateUserId: number, voterUserId: number, approve: boolean) => {
        const response = await api.post<{ status: string }>(`/events/${eventId}/vote`, null, {
            params: { candidate_user_id: candidateUserId, voter_user_id: voterUserId, approve },
        });
        return response.data;
    },

    removeParticipant: async (eventId: string | number, userId: number, adminId: number) => {
        const response = await api.delete<{ status: string }>(`/events/${eventId}/participants/${userId}`, {
            params: { admin_id: adminId },
        });
        return response.data;
    },

    getParticipants: async (eventId: string | number) => {
        const response = await api.get<{ user_id: number, is_active: boolean }[]>(`/events/${eventId}/participants`);
        return response.data;
    },

    // 3. Deposit Funds
    depositFunds: async (eventId: string | number, userId: number, amount: number) => {
        const response = await api.post<{ status: string }>(`/pool/deposit`, null, {
            params: { event_id: eventId, user_id: userId, amount },
        });
        return response.data;
    },

    getPoolBalance: async (eventId: string | number) => {
        const response = await api.get<{ balance: number }>(`/pool/${eventId}/balance`);
        return response.data.balance;
    },

    // 4. Create Category
    createCategory: async (eventId: string | number, categoryName: string) => {
        const response = await api.post<ExpenseCategory>(`/categories`, null, {
            params: { event_id: eventId, name: categoryName },
        });
        return response.data;
    },

    getCategories: async (eventId: string | number) => {
        const response = await api.get<ExpenseCategory[]>(`/categories`, {
            params: { event_id: eventId },
        });
        return response.data;
    },

    // 5. Join Category
    joinCategory: async (categoryId: number, userId: number) => {
        const response = await api.post<{ status: string }>(`/categories/${categoryId}/join`, null, {
            params: { user_id: userId },
        });
        return response.data;
    },

    // 6. Create Expense (Payment Intent)
    createExpense: async (eventId: string | number, categoryId: number, amount: number) => {
        const response = await api.post<PaymentIntentResponse>(`/expenses`, null, {
            params: { event_id: eventId, category_id: categoryId, amount },
        });
        return response.data;
    },

    // 7. Check Payment Status (via Finternet directly or backend if proxy)
    checkPaymentStatus: async (intentId: string) => {
        // Spec says GET https://api.fmm.finternetlab.io/api/v1/payment-intents/{intent_id}
        const response = await finternetApi.get<PaymentStatus>(`/payment-intents/${intentId}`);
        return response.data;
    },

    // 8. Release Payment
    releasePayment: async (intentId: string) => {
        const response = await finternetApi.post<{ status: string }>(`/payment-intents/${intentId}/release`);
        return response.data;
    },

    // 9. Get Ledger Entries
    getLedgerEntries: async () => {
        const response = await finternetApi.get<{ entries: LedgerEntry[] }>(`/payment-intents/account/ledger-entries`);
        return response.data.entries;
    },

    // 10. Get Settlement
    getSettlement: async (eventId: string | number) => {
        const response = await api.get<SettlementResponse>(`/settlement/${eventId}`);
        return response.data;
    },

    // 11. Process Refunds
    processRefunds: async (eventId: string | number) => {
        const response = await api.post<{ status: string }>(`/refunds/process`, null, {
            params: { event_id: eventId },
        });
        return response.data;
    },
};

