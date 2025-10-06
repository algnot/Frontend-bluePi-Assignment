import { NextRequest, NextResponse } from 'next/server';

const OMISE_SECRET_KEY = 'skey_test_62dmu6r7mqs66dubx2b';
const OMISE_API_BASE = 'https://api.omise.co';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${OMISE_API_BASE}/charges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(OMISE_SECRET_KEY + ':')}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error: error.message || 'Failed to create charge' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Omise API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
