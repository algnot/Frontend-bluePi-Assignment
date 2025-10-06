import { NextRequest, NextResponse } from 'next/server';

const OMISE_SECRET_KEY = 'skey_test_62dmu6r7mqs66dubx2b';
const OMISE_API_BASE = 'https://api.omise.co';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chargeId: string }> }
) {
    try {
        const { chargeId } = await params;

        const response = await fetch(`${OMISE_API_BASE}/charges/${chargeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(OMISE_SECRET_KEY + ':')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error: error.message || 'Failed to retrieve charge' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Omise API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
