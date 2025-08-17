interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // in kobo
  currency?: string;
  ref: string;
  onClose: () => void;
  callback: (response: any) => void;
  metadata?: Record<string, any>;
}

// This tells TypeScript that PaystackPop is a global variable provided by the script
declare const PaystackPop: {
  setup: (config: PaystackConfig) => {
    openIframe: () => void;
  };
};

export const initiatePaystackPayment = (onSuccess: (response: any) => void, onCancel: () => void) => {
  // IMPORTANT: In a real application, the public key should be stored securely in environment variables
  // and accessed via a backend endpoint. For this front-end only demo, we are using a public test key.
  const paystackTestPublicKey = 'pk_test_6146052219e487843de3295e82645371235b2639';

  const handler = PaystackPop.setup({
    key: paystackTestPublicKey,
    email: 'demo.user@example.com', // In a real app, get this from the logged-in user context
    amount: 500000, // 5000 NGN in kobo
    currency: 'NGN',
    ref: `ai_mastering_${Date.now()}`,
    onClose: () => {
      // This is called when the user closes the payment pop-up
      onCancel();
    },
    callback: (response) => {
      // This callback is called after a successful transaction
      // In a real application, you should send the `response.reference` to your backend for verification
      onSuccess(response);
    },
    metadata: {
      custom_fields: [
        {
          display_name: "Service",
          variable_name: "service",
          value: "AI Mastering Studio - Pro Upgrade"
        }
      ]
    }
  });

  handler.openIframe();
};
