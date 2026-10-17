
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';


export interface PenaltyCharge {
  penaltyChargeId: number;
  emiScheduleId: number;
  loanAccountId: number;
  penaltyAmount: number;
  reason: string;
  status: string;
  penaltyDate: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MyPenaltyService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8081/api/payment/penalties';

  getPenalties(loanAccountId: number) {
    return this.http.get<PenaltyCharge[]>(
      `${this.apiUrl}/${loanAccountId}`,
      { timeout: 10000 }
    );
  }
}
