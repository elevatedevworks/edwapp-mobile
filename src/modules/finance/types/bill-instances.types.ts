export type BillInstanceStatus =
  | 'unpaid'
  | 'partial'
  | 'paid'
  | 'overdue'
  | string;

export type BillInstance = {
  id: string;
  ownerUsedId: string;
  billId: string;
  periodYear: number;
  periodMonth: number;
  dueDate: string;
  amountDueCents: number;
  amountPaidCents: number;
  status: BillInstanceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BillInstancesResponse = {
  data: BillInstance[];
};

export type BillInstanceResponse = {
  data: BillInstance;
};

export type CreateBillInstanceInput = {
  billId: string;
  periodYear: number;
  periodMonth: number;
  dueDate: string;
  amountDueCents: number;
  notes?: string | null;
};
