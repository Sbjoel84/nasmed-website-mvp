/// <reference types="vite/client" />

declare module '@paystack/inline-js' {
  interface PaystackTransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    label?: string;
    metadata?: Record<string, unknown>;
    onSuccess?: (transaction: Record<string, unknown>) => void;
    onCancel?: () => void;
  }
  export default class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): void;
  }
}
