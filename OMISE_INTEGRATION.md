# Omise PromptPay Integration

This project has been integrated with Omise PromptPay API for payment processing.

## Features Implemented

1. **PromptPay QR Code Generation**: Creates QR codes for customers to scan with their banking apps
2. **Payment Flow**: Complete payment flow from checkout to completion
3. **Real-time Status Updates**: Polls payment status and updates UI accordingly
4. **Webhook Support**: Handles payment completion events via webhooks
5. **Error Handling**: Comprehensive error handling for failed/expired payments

## API Keys Used

- **Public Key**: `pkey_test_62dmu6qura7vlqr19nn`
- **Secret Key**: `skey_test_62dmu6r7mqs66dubx2b`

## Files Added/Modified

### New Files

- `src/types/omise.ts` - TypeScript types for Omise API
- `src/services/omise.ts` - Omise service for API calls
- `src/app/pay/[orderId]/page.tsx` - Payment page with QR code display
- `src/app/api/webhooks/omise/route.ts` - Webhook handler for payment events

### Modified Files

- `src/app/order/page.tsx` - Updated checkout flow to redirect to payment page
- `package.json` - Added Omise.js dependency

## Payment Flow

1. Customer adds items to cart
2. Customer clicks "Checkout" button
3. System creates order via existing API
4. Customer is redirected to payment page (`/pay/[orderId]`)
5. System creates PromptPay charge with Omise
6. QR code is displayed for customer to scan
7. System polls payment status every 3 seconds
8. On successful payment:
   - Cart is cleared
   - Success message is shown
   - Customer is redirected to home page

## Webhook Configuration

To receive payment completion events, configure the webhook endpoint in your Omise dashboard:

**Webhook URL**: `https://yourdomain.com/api/webhooks/omise`

**Events to listen for**:

- `charge.complete`

## Testing

The integration uses Omise test keys, so you can test the payment flow using test data. The QR codes generated will be test QR codes that won't process real payments.

## Production Considerations

1. **Replace test keys** with live keys from Omise
2. **Implement webhook signature verification** for security
3. **Add proper error logging** and monitoring
4. **Configure proper webhook endpoints** in Omise dashboard
5. **Add rate limiting** to prevent abuse
6. **Implement proper order status updates** in your database

## Dependencies

- `omise` - Official Omise.js library for client-side integration
- `sweetalert2` - For user-friendly notifications (already included)

## API Endpoints

- `POST /api/webhooks/omise` - Webhook endpoint for payment events
- `GET /pay/[orderId]` - Payment page with QR code
