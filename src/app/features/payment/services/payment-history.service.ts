
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface PaymentHistory {
  paymentId: number;
  loanAccountId: number;
  emiScheduleId: number | null;
  paymentAmount: number;
  paymentDate: string;
  paymentStatus: string;
  paymentName: string;
  transactionRefNo: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/payment/history';

  getHistory(loanAccountId: number) {
    return this.http.get<PaymentHistory[]>(
      `${this.apiUrl}/${loanAccountId}`,
      { timeout: 10000 }
    );
  }
}
