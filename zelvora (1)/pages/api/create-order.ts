// This file represents the Server-Side Next.js API Route.
// In a real deployment, this would live at https://pay.zelvora.com/api/create-order
// It ensures the Razorpay Key Secret is NEVER exposed to the client.

import Razorpay from 'razorpay'; // Hypothetical import for Next.js environment

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { plan, amount } = req.body;

  // 1. Initialize Razorpay with Server-Side Keys
  // process.env.RAZORPAY_KEY_ID and process.env.RAZORPAY_KEY_SECRET must be set in Vercel
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    // 2. Create Order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      notes: {
        plan_type: plan,
        app_source: "zelvora_web"
      }
    };

    const order = await razorpay.orders.create(options);

    // 3. Return ONLY the Order ID to the frontend
    // The frontend never sees the Key Secret.
    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount
    });

  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}