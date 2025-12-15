import { AdminPaymentRecord, UserPlan, RazorpayWebhookPayload } from '../types';

/**
 * ZELVORA PAYMENT SECURITY SERVICE
 * 
 * Handles strict server-side verification of Razorpay webhooks.
 * This ensures no fake requests can upgrade a user's plan.
 * 
 * NOTE: For this frontend demo, we have removed the 'crypto' dependency
 * to prevent browser runtime errors. In a real Node.js environment, 
 * you would import 'crypto' and verify signatures.
 */

// Safe access to environment variable
const getEnvVar = (key: string, defaultVal: string) => {
  try {
    return process.env[key] || defaultVal;
  } catch {
    return defaultVal;
  }
};

const WEBHOOK_SECRET = getEnvVar('RAZORPAY_WEBHOOK_SECRET', 'test_secret');

// Plan Mapping: Amount (in paise) -> Plan Name
const PLAN_MAP: Record<number, UserPlan> = {
  49900: 'Placement Prep',
  99900: 'Pro'
};

class PaymentService {

  // --------------------------------------------------
  // 1. SIGNATURE VERIFICATION (CRITICAL)
  // --------------------------------------------------
  public verifyWebhookSignature(body: string, signature: string): boolean {
    // SIMULATION MODE for Browser Compatibility
    // In a real app, use crypto.createHmac('sha256', secret).update(body).digest('hex')
    if (!WEBHOOK_SECRET) {
      console.error("[PAYMENT SECURITY] Webhook secret not configured.");
      return false;
    }

    console.log("[PAYMENT SECURITY] Simulating signature verification for demo.");
    return true; 
  }

  // --------------------------------------------------
  // 2. IDEMPOTENCY CHECK
  // --------------------------------------------------
  private isTransactionProcessed(paymentId: string): boolean {
    if (typeof window !== 'undefined') {
       // In a real app, check DB. Here we use localStorage as our "DB"
       const transactions = JSON.parse(localStorage.getItem('zelvora_admin_payments') || '[]');
       return transactions.some((t: AdminPaymentRecord) => t.razorpayPaymentId === paymentId);
    }
    return false;
  }

  // --------------------------------------------------
  // 3. CORE PROCESSING LOGIC
  // --------------------------------------------------
  public async processPaymentCaptured(payload: RazorpayWebhookPayload['payload']['payment']['entity']) {
    
    // A. Idempotency Guard
    if (this.isTransactionProcessed(payload.id)) {
        console.warn(`[PAYMENT] Duplicate event ignored for Payment ID: ${payload.id}`);
        return;
    }

    // B. Amount Validation
    const paidAmount = payload.amount; // In paise
    const expectedPlan = PLAN_MAP[paidAmount];

    if (!expectedPlan) {
        console.error(`[PAYMENT SECURITY] Amount mismatch. Paid: ${paidAmount}, No matching plan found.`);
        // Record as FAILED/SUSPICIOUS in DB
        this.recordTransaction(payload, 'FAILED', 'Unknown Plan Amount');
        return;
    }

    // C. Data Extraction
    const userId = payload.email; // Mapping email to user for this example
    const method = this.mapPaymentMethod(payload.method);

    console.log(`[PAYMENT] Verified. Upgrading ${userId} to ${expectedPlan}`);

    // D. Upgrade Logic (DB Update)
    this.upgradeUserPlan(userId, expectedPlan);

    // E. Audit Log (DB Insert)
    this.recordTransaction(payload, 'SUCCESS', expectedPlan);
  }

  // --------------------------------------------------
  // 4. DATABASE UPDATES (SIMULATED)
  // --------------------------------------------------
  private upgradeUserPlan(userEmail: string, plan: UserPlan) {
    if (typeof window === 'undefined') return;

    // Simulate DB update: In production, use SQL UPDATE
    // UPDATE users SET plan = $1 WHERE email = $2
    
    // For demo continuity, we update local storage "DB"
    // Note: In a real architecture, the Frontend polls an endpoint to see if this update happened
    const currentUserEmail = "user@example.com"; // Hardcoded for demo context
    if (userEmail === currentUserEmail || userEmail) {
        localStorage.setItem('zelvora_user_plan', plan);
        if (plan === 'Placement Prep') {
            localStorage.setItem('zelvora_user_role', 'POWER_CANDIDATE');
        }
    }
  }

  private recordTransaction(
      data: RazorpayWebhookPayload['payload']['payment']['entity'], 
      status: 'SUCCESS' | 'FAILED', 
      planName: string
  ) {
    if (typeof window === 'undefined') return;

    const record: AdminPaymentRecord = {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        userId: 'USR-' + Math.floor(Math.random() * 1000),
        userEmail: data.email,
        plan: planName as UserPlan,
        amount: data.amount / 100, // Store in Rupees
        status: status,
        method: this.mapPaymentMethod(data.method),
        date: new Date().toISOString().split('T')[0],
        razorpayPaymentId: data.id,
        razorpayOrderId: data.order_id
    };

    // Simulate DB Insert
    const existing = JSON.parse(localStorage.getItem('zelvora_admin_payments') || '[]');
    existing.unshift(record); // Add to top
    localStorage.setItem('zelvora_admin_payments', JSON.stringify(existing));
  }

  private mapPaymentMethod(method: string): 'UPI' | 'CARD' | 'NET_BANKING' {
      if (method === 'upi') return 'UPI';
      if (method === 'card') return 'CARD';
      if (method === 'netbanking') return 'NET_BANKING';
      return 'CARD';
  }

  // --------------------------------------------------
  // 5. REFUND LOGIC (NEW)
  // --------------------------------------------------

  /**
   * Checks if a transaction is eligible for refund based on:
   * 1. 24 Hour Window
   * 2. Usage (Simulated)
   */
  public checkRefundEligibility(payment: AdminPaymentRecord): { eligible: boolean; reason: string } {
      // 1. Check Date (24 Hour Window)
      const paymentDate = new Date(payment.date);
      const now = new Date();
      // Assume payment.date is roughly today for demo, or parse correctly
      // In production, compare timestamps. 
      // Here, if date string is not today's ISO date, assume old.
      const todayStr = now.toISOString().split('T')[0];
      
      if (payment.date !== todayStr) {
          return { eligible: false, reason: "Request exceeds 24-hour window." };
      }

      // 2. Check Status
      if (payment.status !== 'SUCCESS') {
          return { eligible: false, reason: "Payment was not successful or already refunded." };
      }

      // 3. Check Usage (Simulated)
      // In real app: SELECT count(*) FROM interviews WHERE user_id = ? AND created_at > payment.date
      const hasUsage = Math.random() > 0.5; // Randomly simulate usage for demo
      if (hasUsage) {
           return { eligible: false, reason: "Service Consumed: User has accessed reports/interviews." };
      }

      return { eligible: true, reason: "Eligible: Within 24h & No Usage Detected." };
  }

  public processRefund(paymentId: string): boolean {
      if (typeof window === 'undefined') return false;

      const transactions = JSON.parse(localStorage.getItem('zelvora_admin_payments') || '[]');
      const index = transactions.findIndex((t: AdminPaymentRecord) => t.id === paymentId);

      if (index !== -1) {
          transactions[index].status = 'REFUNDED'; // Update status
          localStorage.setItem('zelvora_admin_payments', JSON.stringify(transactions));
          console.log(`[PAYMENT] Refund processed for ${paymentId}`);
          return true;
      }
      return false;
  }
}

export const paymentService = new PaymentService();