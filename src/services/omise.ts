import {
    CreateChargeRequest,
    OmiseSource,
    OmiseCharge,
    OmiseError
} from '@/types/omise';

// Omise API Configuration
const OMISE_PUBLIC_KEY = 'pkey_test_62dmu6qura7vlqr19nn';
const OMISE_SECRET_KEY = 'skey_test_62dmu6r7mqs66dubx2b';
const OMISE_API_BASE = 'https://api.omise.co';

export class OmiseService {
    private static instance: OmiseService;

    public static getInstance(): OmiseService {
        if (!OmiseService.instance) {
            OmiseService.instance = new OmiseService();
        }
        return OmiseService.instance;
    }

    /**
     * Create a PromptPay source using Omise.js (client-side)
     */
    async createPromptPaySource(amount: number): Promise<OmiseSource> {
        return new Promise((resolve, reject) => {
            // Load Omise.js dynamically
            const script = document.createElement('script');
            script.src = 'https://cdn.omise.co/omise.js';
            script.onload = () => {
                // @ts-ignore - Omise is loaded dynamically
                if (typeof window.Omise === 'undefined') {
                    reject(new Error('Failed to load Omise.js'));
                    return;
                }

                // @ts-ignore
                window.Omise.setPublicKey(OMISE_PUBLIC_KEY);

                // @ts-ignore
                window.Omise.createSource('promptpay', {
                    amount: amount * 100, // Convert to satang (subunits)
                    currency: 'THB'
                }, (statusCode: number, response: OmiseSource | OmiseError) => {
                    if (statusCode === 200) {
                        resolve(response as OmiseSource);
                    } else {
                        reject(new Error((response as OmiseError).message || 'Failed to create source'));
                    }
                });
            };
            script.onerror = () => reject(new Error('Failed to load Omise.js'));
            document.head.appendChild(script);
        });
    }

    /**
     * Create a charge using the source (server-side)
     */
    async createCharge(sourceId: string, amount: number, orderId?: string, expiresAt?: string): Promise<OmiseCharge> {
        const requestBody: CreateChargeRequest & { metadata?: { order_id: string } } = {
            amount: amount * 100, // Convert to satang
            currency: 'THB',
            source: {
                type: 'promptpay'
            }
        };

        if (orderId) {
            requestBody.metadata = { order_id: orderId };
        }

        if (expiresAt) {
            requestBody.expires_at = expiresAt;
        }

        const response = await fetch('/api/omise/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error: OmiseError = await response.json();
            throw new Error(error.message || 'Failed to create charge');
        }

        return response.json();
    }

    /**
     * Create source and charge in a single request (server-side)
     */
    async createSourceAndCharge(amount: number, orderId?: string, expiresAt?: string): Promise<OmiseCharge> {
        const requestBody: CreateChargeRequest & { metadata?: { order_id: string } } = {
            amount: amount * 100, // Convert to satang
            currency: 'THB',
            source: {
                type: 'promptpay'
            }
        };

        if (orderId) {
            requestBody.metadata = { order_id: orderId };
        }

        if (expiresAt) {
            requestBody.expires_at = expiresAt;
        }

        const response = await fetch('/api/omise/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error: OmiseError = await response.json();
            throw new Error(error.message || 'Failed to create charge');
        }

        return response.json();
    }

    /**
     * Retrieve charge status
     */
    async getCharge(chargeId: string): Promise<OmiseCharge> {
        const response = await fetch(`/api/omise/charges/${chargeId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error: OmiseError = await response.json();
            throw new Error(error.message || 'Failed to retrieve charge');
        }

        return response.json();
    }

    /**
     * Set expiration time (5 minutes from now)
     */
    getExpirationTime(): string {
        const now = new Date();
        const expirationTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
        return expirationTime.toISOString();
    }
}

// Export singleton instance
export const omiseService = OmiseService.getInstance();
