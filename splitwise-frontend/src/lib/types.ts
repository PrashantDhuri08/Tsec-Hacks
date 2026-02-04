export interface User {
    id: number;
    email: string;
    wallet_balance: number;
}

export interface RegisterResponse {
    id: number;
    email: string;
    wallet_balance: number;
}

export interface LoginResponse {
    user_id: number;
}

export interface Event {
    id: number;
    title: string;
    admin_user_id: number;
}

export interface Participant {
    user_id: number;
    is_active: boolean;
}

export interface ExpenseCategory {
    id: number;
    name: string;
}

export interface PaymentIntentResponse {
    intent_id: string;
    payment_url: string;
    status: string;
}

export interface PaymentStatus {
    status: string;
    settlementStatus: string;
}

export interface SettlementResponse {
    [userId: string]: number;
}

export interface LedgerEntry {
    reference: string;
    amount: string;
    status: string;
}

