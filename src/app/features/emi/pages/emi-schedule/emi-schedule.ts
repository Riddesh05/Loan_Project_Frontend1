
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectedLoanAccountService } from '../../services/selected-loan-account.service';



import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { finalize } from 'rxjs';
import { Emi } from '../../services/emi';
import { PaymentBreakdown } from '../../models/payment-breakdown.model';
import { NotificationResponse } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-emi-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './emi-schedule.html',
  styleUrl: './emi-schedule.css'
})
export class EmiSchedule {
notificationsOpen: boolean = false;
toggleNotifications(): void {
  this.notificationsOpen = !this.notificationsOpen;

  if (
    this.notificationsOpen &&
    this.loanAccountId &&
    this.loanAccountId > 0
  ) {
    this.loadNotifications(this.loanAccountId);
  }
}
  loanAccountId: number | null = null;

  schedule: any[] = [];
  summary: any = null;

  loading = false;
  errorMessage = '';


  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 15, 20];

  get paginatedSchedule(): any[] {
    const startIndex = this.pageIndex * this.pageSize;

    return this.schedule.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get pageEnd(): number {
    return Math.min(
      (this.pageIndex + 1) * this.pageSize,
      this.schedule.length
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }


  selectedEmi: any = null;
  paymentBreakdown: PaymentBreakdown | null = null;

  paymentModalOpen = false;
  breakdownLoading = false;
  breakdownError = '';

  constructor(
    private emiService: Emi,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private selectedLoanAccountService: SelectedLoanAccountService
  ) {}


  loadSchedule(): void {

   if (
    this.loanAccountId === null ||
    this.loanAccountId === undefined ||
    this.loanAccountId <= 0
  ) {
    return;
  }

  this.selectedLoanAccountService.setLoanAccountId(
    this.loanAccountId
  );
    this.loading = true;
    this.errorMessage = '';
    this.schedule = [];
    this.summary = null;

    // Reset pagination to first page
    this.pageIndex = 0;

    this.emiService.getSchedule(this.loanAccountId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({

        next: (response: any) => {

          console.log('Schedule response:', response);

          this.schedule = Array.isArray(response) ? response : [];
          this.loadNotifications(this.loanAccountId!);

          if (this.schedule.length === 0) {
            this.errorMessage =
              'Is loan account ke liye EMI schedule nahi mila.';
          } else {
            this.loadSummary();
          }
        },

        error: (error: HttpErrorResponse) => {

          console.error('Schedule API error:', error);

          this.errorMessage =
            error.status === 0
              ? 'Backend connection/CORS issue. Please check backend configuration.'
              : `Schedule load failed. HTTP ${error.status}`;
        }
      });
  }



  

  loadSummary(): void {

    if (this.loanAccountId == null) {
      return;
    }

    this.emiService.getSummary(this.loanAccountId).subscribe({

      next: (response: any) => {
        this.summary = response;
      },

      error: (error: HttpErrorResponse) => {

        console.error('EMI summary fetch failed:', error);

        this.summary = null;
      }
    });
  }


// LOAD NOTIFICATIONS

loadNotifications(loanAccountId: number): void {
  this.notificationLoading = true;
  this.notificationError = '';

  this.notificationService
    .getNotifications(loanAccountId)
    .pipe(
      finalize(() => {
        this.notificationLoading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (response: NotificationResponse[]) => {
        this.notifications = Array.isArray(response)
          ? response
          : [];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Notification API error:', error);
        this.notifications = [];
        this.notificationError =
          'Notifications load nahi ho paayi. Please try again.';
      }
    });
}

// =========================
// MARK NOTIFICATION AS READ
// =========================

markNotificationAsRead(
  notification: NotificationResponse
): void {
  if (notification.isRead) {
    return;
  }

  this.notificationService
    .markAsRead(notification.notificationId)
    .subscribe({
      next: (response: NotificationResponse) => {
        this.notifications = this.notifications.map(item =>
          item.notificationId === response.notificationId
            ? response
            : item
        );

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Mark notification as read failed:', error);
      }
    });
}


  generateSchedule(): void {
    

    if (this.loanAccountId == null || this.loanAccountId <= 0) {
      this.errorMessage = 'Please enter a valid Loan Account ID.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.pageIndex = 0;

    this.emiService.generateSchedule(this.loanAccountId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({

        next: () => {
          this.loadSchedule();
        },

        error: (error: HttpErrorResponse) => {

          console.error('EMI generation failed:', error);

          this.errorMessage =
            typeof error.error === 'string'
              ? error.error
              : error.error?.message ||
                `Could not generate schedule. HTTP status: ${error.status}`;
        }
      });
  }

  // =========================
  // OPEN PAYMENT MODAL
  // =========================

  openPayment(item: any): void {

    if (
      item.paymentStatus !== 'Pending' ||
      item.isPayable !== true
    ) {
      return;
    }

    this.selectedEmi = item;
    this.paymentBreakdown = null;
    this.breakdownError = '';

    this.paymentModalOpen = true;
    this.breakdownLoading = true;

    this.emiService.getPaymentBreakdown(item.emiScheduleId)
      .subscribe({

        next: (response: PaymentBreakdown) => {

          console.log('Payment breakdown response:', response);

          this.paymentBreakdown = response;
          this.breakdownLoading = false;

          this.cdr.detectChanges();
        },

        error: (error: HttpErrorResponse) => {

          console.error('Payment breakdown failed:', error);

          this.breakdownLoading = false;

          this.breakdownError =
            error.status === 0
              ? 'Backend connection/CORS issue.'
              : `Payment breakdown load nahi hua. HTTP ${error.status}`;

          this.cdr.detectChanges();
        }
      });
  }

  // =========================
  // RAZORPAY PAYMENT
  // =========================

  payWithRazorpay(): void {

    if (
      !this.selectedEmi ||
      !this.paymentBreakdown ||
      !this.loanAccountId ||
      this.breakdownLoading
    ) {
      return;
    }

    const emiScheduleId = Number(
      this.selectedEmi.emiScheduleId
    );

    const loanAccountId = Number(this.loanAccountId);

    this.breakdownLoading = true;
    this.breakdownError = '';

    this.emiService.createRazorpayOrder(emiScheduleId)
      .subscribe({

        next: (order: any) => {
          this.openRazorpayCheckout(
            order,
            loanAccountId,
            emiScheduleId
          );
        },

        error: (error: HttpErrorResponse) => {

          this.breakdownLoading = false;

          this.breakdownError =
            error.error?.message ||
            'Razorpay order create nahi hua.';

          this.cdr.detectChanges();
        }
      });
  }

  private openRazorpayCheckout(
    order: any,
    loanAccountId: number,
    emiScheduleId: number
  ): void {

    const openCheckout = () => {

      if (!(window as any).Razorpay) {

        this.breakdownLoading = false;

        this.breakdownError =
          'Razorpay Checkout load nahi hua. Dobara try karo.';

        this.cdr.detectChanges();
        return;
      }

      const options = {

        key: order.keyId,
        amount: order.amount,
        currency: order.currency,

        name: 'Loan Management System',

        description: `EMI Payment - Schedule ${emiScheduleId}`,

        order_id: order.orderId,

        handler: (response: any) => {

          this.breakdownLoading = true;
          this.cdr.detectChanges();

          this.emiService.verifyRazorpayPayment({

            loanAccountId,
            emiScheduleId,

            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature

          }).subscribe({

            next: () => {

              this.breakdownLoading = false;
              this.paymentModalOpen = false;

              this.selectedEmi = null;
              this.paymentBreakdown = null;

              // Refresh the complete schedule and summary
              this.loadSchedule();
              this.loadSummary();

              this.cdr.detectChanges();
            },

            error: (error: HttpErrorResponse) => {

              this.breakdownLoading = false;

              this.breakdownError =
                error.error?.message ||
                'Payment verification failed. Payment status backend se verify karo.';

              this.cdr.detectChanges();
            }
          });
        },

        modal: {
          ondismiss: () => {

            this.breakdownLoading = false;
            this.cdr.detectChanges();
          }
        },

        theme: {
          color: '#075bbb'
        }
      };

      this.breakdownLoading = false;
      this.cdr.detectChanges();

      const checkout = new (window as any).Razorpay(options);

      checkout.on('payment.failed', (response: any) => {

        this.breakdownError =
          response.error?.description ||
          'Payment failed. Please try again.';

        this.cdr.detectChanges();
      });

      checkout.open();
    };

    const razorpayWindow = window as any;

    if (razorpayWindow.Razorpay) {
      openCheckout();
      return;
    }

    const script = document.createElement('script');

    script.src =
      'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = openCheckout;

    script.onerror = () => {

      this.breakdownLoading = false;
      this.breakdownError = 'Razorpay script load nahi hua.';

      this.cdr.detectChanges();
    };

    document.body.appendChild(script);
  }

  // =========================
  // CLOSE PAYMENT MODAL
  // =========================

  closePayment(): void {

    if (this.breakdownLoading) {
      return;
    }

    this.paymentModalOpen = false;
    this.selectedEmi = null;
    this.paymentBreakdown = null;
    this.breakdownError = '';
  }

  viewBreakdown(): void {

    if (this.selectedEmi) {
      this.openPayment(this.selectedEmi);
    }
  }


  // =========================
// NOTIFICATIONS
// =========================

notifications: NotificationResponse[] = [];
notificationLoading = false;
notificationError = '';

get unreadNotificationCount(): number {
  return this.notifications.filter(
    notification => !notification.isRead
  ).length;
}
}
