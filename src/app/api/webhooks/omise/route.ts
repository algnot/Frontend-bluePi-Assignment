import { NextRequest, NextResponse } from 'next/server';
import { omiseService } from '@/services/omise';
import { OmiseCharge } from '@/types/omise';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Verify webhook signature (in production, you should verify the signature)
        // const signature = request.headers.get('x-omise-signature');
        // if (!verifyWebhookSignature(body, signature)) {
        //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        const { type, data } = body;

        if (type === 'charge.complete') {
            const charge: OmiseCharge = data;

            console.log('Payment completed:', {
                chargeId: charge.id,
                status: charge.status,
                amount: charge.amount,
                orderId: charge.metadata?.order_id // You should include order_id in metadata when creating charge
            });

            // Handle successful payment
            if (charge.status === 'successful') {
                // Update order status in your database
                // await updateOrderStatus(charge.metadata?.order_id, 'paid');

                // Send confirmation email, update inventory, etc.
                console.log('Order payment successful:', charge.metadata?.order_id);
            } else if (charge.status === 'failed') {
                // Handle failed payment
                console.log('Order payment failed:', charge.metadata?.order_id);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

// Function to verify webhook signature (implement this for production)
function verifyWebhookSignature(payload: any, signature: string | null): boolean {
    // Implement signature verification using your webhook secret
    // This is important for security in production
    return true; // For now, always return true
}
