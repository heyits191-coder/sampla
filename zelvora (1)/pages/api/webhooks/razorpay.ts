import { paymentService } from '../../../services/PaymentService';
import { RazorpayWebhookPayload } from '../../../types';

// Disable default body parser to verify raw signature
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw stream
async function getRawBody(readable: any): Promise<string> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Capture Raw Body & Signature
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
      console.error("[WEBHOOK] Missing signature header.");
      return res.status(400).json({ message: 'Missing signature' });
    }

    // 2. Verify Signature (Strict Security)
    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error("[WEBHOOK] Invalid signature detected. Possible tampering.");
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // 3. Parse JSON safely
    const event: RazorpayWebhookPayload = JSON.parse(rawBody);

    // 4. Handle Specific Events
    // We only care about success (payment.captured). 
    // Razorpay also sends order.paid, payment.authorized etc.
    if (event.event === 'payment.captured') {
        const paymentEntity = event.payload.payment.entity;
        
        await paymentService.processPaymentCaptured(paymentEntity);
        
        console.log(`[WEBHOOK] Successfully processed payment ${paymentEntity.id}`);
    } else {
        // Log other events but don't error out
        console.log(`[WEBHOOK] Ignoring unhandled event: ${event.event}`);
    }

    // 5. Acknowledge Receipt
    // Always return 200 OK to Razorpay to prevent them from retrying the webhook
    return res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error("[WEBHOOK] Internal Error:", error);
    // Return 500 so Razorpay knows to retry later if it was a genuine server error
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}