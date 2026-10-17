
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Emi {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/emi-schedule';

  getSchedule(loanAccountId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/${loanAccountId}`,
      { timeout: 10000 }
    );
  }

  getSummary(loanAccountId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/summary/${loanAccountId}`,
      { timeout: 10000 }
    );
  }

  generateSchedule(loanAccountId: number) {
    return this.http.post<any>(
      `${this.apiUrl}/generate`,
      { loanAccountId },
      { timeout: 10000 }
    );
  }




getPaymentBreakdown(emiScheduleId: number) {
  return this.http.get<import('../models/payment-breakdown.model').PaymentBreakdown>(
    `http://localhost:8081/api/payment/breakdown/${emiScheduleId}`,
    { timeout: 10000 }
  );
}



createRazorpayOrder(emiScheduleId: number) {
  return this.http.post<any>(
    'http://localhost:8081/api/payment/razorpay/create-order',
    { emiScheduleId },
    { timeout: 15000 }
  );
}

verifyRazorpayPayment(payload: {
  loanAccountId: number;
  emiScheduleId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return this.http.post<any>(
    'http://localhost:8081/api/payment/razorpay/verify',
    payload,
    { timeout: 20000 }
  );
}

}
