export type ReportPeriod = {
  month: number;
  year: number;
  startDate: string;
  endDate: string;
};

export type AccountSummary = {
  count: number;
  totalBalanceCents: number;
};

export type BillSummary = {
  activeCount: number;
  overdueCount: number;
  upcomingCount: number;
  monthlyTotalCents: number;
};

export type CashFlowSummary = {
  inflowCents: number;
  outflowCents: number;
  netCents: number;
};

export type CreditCardSummary = {
  totalAvailableCreditCents: number;
  totalCurrentCreditBalanceCents: number;
  totalCreditLimit: number;
};

export type PaymentDirection = 'inflow' | 'outflow' | string;

export type RecentPayment = {
  id: string;
  ownerUserId: string;
  accountId: string;
  billId: string;
  amountCents: number;
  paymentDate: string;
  direction: PaymentDirection;
  method: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReminderMode = 'absolute' | 'relative' | string;
export type ReminderStatus = 'pending' | 'completed' | 'dismissed' | string;

export type UpcomingReminder = {
  id: string;
  ownerUserId: string;
  billId: string | null;
  title: string;
  mode: ReminderMode;
  remindAt: string;
  offsetDays: number | null;
  status: ReminderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportsOverviewResponse = {
  data: {
    period: ReportPeriod;
    accounts: AccountSummary;
    bills: BillSummary;
    cashFlow: CashFlowSummary;
    creditCards: CreditCardSummary;
    // payments: {
    //   recent: RecentPayment[];
    // };
    // reminders: {
    //   upcoming: UpcomingReminder[];
    // };
  };
};
