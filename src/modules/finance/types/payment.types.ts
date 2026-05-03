export type PaymentDirection = 'inflow' | 'outflow' | string;

export type Payment = {
  id: string;
  ownerUserId: string;
  accountId: string | null;
  billId: string | null;
  amountCents: number;
  paymentDate: string;
  direction: PaymentDirection;
  method: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentsResponse = {
  data: Payment[];
};

export type CreatePaymentInput = {
  accountId: string;
  billId: string;
  amountCents: number;
  paymentDate: string;
  direction: 'inflow' | 'outflow';
  method: string;
  reference?: string;
  notes?: string;
};

export type PaymentResponse = {
  data: Payment;
};
