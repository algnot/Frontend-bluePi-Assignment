// Omise API Types for PromptPay Integration

export interface OmiseSource {
    object: string;
    id: string;
    livemode: boolean;
    location: string;
    amount: number;
    currency: string;
    flow: string;
    type: string;
    charge_status: string;
    scannable_code?: {
        object: string;
        type: string;
        image: {
            object: string;
            id: string;
            filename: string;
            location: string;
            kind: string;
            download_uri: string;
            created_at: string;
        };
        raw_data: any;
    };
    created_at: string;
}

export interface OmiseCharge {
    object: string;
    id: string;
    livemode: boolean;
    location: string;
    amount: number;
    currency: string;
    status: 'pending' | 'successful' | 'failed' | 'expired';
    source: OmiseSource;
    created_at: string;
    paid_at?: string;
    expires_at: string;
    expired_at?: string;
    failure_code?: string;
    failure_message?: string;
    authorize_uri?: string;
    return_uri?: string;
    metadata?: {
        order_id?: string;
        [key: string]: any;
    };
}

export interface CreateSourceRequest {
    amount: number;
    currency: string;
    type: string;
}

export interface CreateChargeRequest {
    amount: number;
    currency: string;
    source: {
        type: string;
    };
    expires_at?: string;
}

export interface OmiseError {
    object: string;
    location: string;
    code: string;
    message: string;
}

// Payment flow states
export type PaymentStatus = 'idle' | 'creating_source' | 'creating_charge' | 'pending' | 'successful' | 'failed' | 'expired';

export interface PaymentState {
    status: PaymentStatus;
    charge?: OmiseCharge;
    error?: string;
    qrCodeUrl?: string;
}
