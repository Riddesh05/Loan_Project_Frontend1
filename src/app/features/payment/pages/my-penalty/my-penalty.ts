import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import {
  MyPenaltyService,
  PenaltyCharge
} from '../../services/my-penalty.service';

@Component({
  selector: 'app-my-penalty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-penalty.html',
  styleUrl: './my-penalty.css'
})
export class MyPenalty implements OnInit {

  private penaltyService = inject(MyPenaltyService);

  readonly loanAccountId = 1;

  penalties: PenaltyCharge[] = [];
  loading = false;
  errorMessage = '';

  // Table columns
  columns: (keyof PenaltyCharge)[] = [
    'penaltyChargeId',
    'emiScheduleId',
    'loanAccountId',
    'penaltyAmount',
    'reason',
    'status',
    'penaltyDate',
    'createdAt'
  ];

  ngOnInit(): void {
    this.loadPenalties();
  }

  loadPenalties(): void {
    this.loading = true;
    this.errorMessage = '';
    this.penalties = [];

    this.penaltyService.getPenalties(this.loanAccountId).subscribe({
      next: (data: PenaltyCharge[]) => {
        console.log('Penalty API response:', data);

        this.penalties = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (error) => {
        console.error('My Penalty API error:', error);

        this.errorMessage =
          error.status === 0
            ? 'Backend se connection nahi ho raha. Spring Boot check karo.'
            : `Penalty details load nahi hui. HTTP ${error.status}`;

        this.loading = false;
      }
    });
  }

  getColumnLabel(column: keyof PenaltyCharge): string {
    const labels: Record<keyof PenaltyCharge, string> = {
      penaltyChargeId: 'Penalty ID',
      emiScheduleId: 'EMI Schedule ID',
      loanAccountId: 'Loan Account ID',
      penaltyAmount: 'Penalty Amount',
      reason: 'Reason',
      status: 'Status',
      penaltyDate: 'Penalty Date',
      createdAt: 'Created At'
    };

    return labels[column];
  }

  displayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    return String(value);
  }

  getPenaltyAmount(penalty: PenaltyCharge): number | null {
    const amount = Number(penalty.penaltyAmount);

    return Number.isFinite(amount) ? amount : null;
  }

  trackByIndex(index: number): number {
    return index;
  }
}