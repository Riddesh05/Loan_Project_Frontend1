
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PaymentHistory,
  PaymentHistoryService
} from '../../services/payment-history.service';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.css'
})
export class PaymentHistoryPage implements OnInit {
  private paymentHistoryService = inject(PaymentHistoryService);

  payments: PaymentHistory[] = [];
  loading = false;
  errorMessage = '';

loanAccountId: number | null = null;
 private route = inject(ActivatedRoute);
ngOnInit(): void {
  this.route.queryParamMap.subscribe(params => {
    const rawId = params.get('loanAccountId');
    const id = Number(rawId);

    if (
      rawId === null ||
      rawId.trim() === '' ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.loanAccountId = null;
      this.payments = [];
      this.loading = false;
      this.errorMessage =
        'Pehle EMI Scheduler mein Loan Account ID enter karke View Schedule karo.';
      return;
    }

    this.loanAccountId = id;
    this.loadHistory(); // Automatically calls API
  });
}

  loadHistory(): void {
  if (this.loanAccountId === null || this.loanAccountId <= 0) {
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.paymentHistoryService
    .getHistory(this.loanAccountId)
    .subscribe({
      next: (data) => {
        this.payments = data ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Payment history error:', error);

        this.payments = [];
        this.errorMessage =
          error.status === 404
            ? 'Loan account nahi mila.'
            : 'Payment history load nahi ho paayi. Please try again.';

        this.loading = false;
      }
    });
}

  trackByPaymentId(index: number, payment: PaymentHistory): number {
    return payment.paymentId;
  }
}
