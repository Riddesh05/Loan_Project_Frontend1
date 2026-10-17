
export interface PaymentBreakdown {
  emiScheduleId: number;
  loanAccountId: number;
  installmentNo: number;

  baseEmi: number;
  carryForwardEmiAmount: number;
  currentMonthEmiAmount: number;
  installmentsIncluded: number;

  bounceCharges: number;
  latePaymentInterest: number;
  overdueDays: number;

  totalPayable: number;
  dailyPenalty: number;
}
