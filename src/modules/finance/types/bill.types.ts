export type BillFrequency =
  | 'one-time'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | string;

export type BillStatus = 'active' | 'inactive' | string;

export type Bill = {
  id: string;
  ownerUserId: string;
  accountId: string | null;
  name: string;
  vendor: string | null;
  amountDueCents: number;
  dueDate: string | null;
  dueDayOfMonth: number | null;
  frequency: BillFrequency;
  status: BillStatus;
  autopay: boolean;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BillsResponse = {
  data: Bill[];
};

export type BillResponse = {
  data: Bill;
};

export type CreateBillInput = {
  accountId?: string;
  name: string;
  vendor?: string;
  amountDueCents: number;
  dueDate?: string | null;
  dueDayOfMonth?: number | null;
  frequency: BillFrequency;
  status: BillStatus;
  autopay: boolean;
  notes?: string;
};

export type UpdateBillInput = {
  name: string;
  vendor?: string;
  accountId?: string;
  amountDueCents: number;
  dueDate?: string | null;
  dueDayOfMonth?: number | null;
  frequency: BillFrequency;
  status: BillStatus;
  autopay: boolean;
  notes?: string;
  isActive: boolean;
};
