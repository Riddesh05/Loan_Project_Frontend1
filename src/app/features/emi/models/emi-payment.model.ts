
export interface EmiPayment {
  loanAccountId: number;
  emiScheduleId: number;
  installmentNo: number;
  dueDate: string;
  emi: number;
  principalAmount: number;
  interestAmount: number;
  paymentStatus: string;
  isPayable: boolean;
}
