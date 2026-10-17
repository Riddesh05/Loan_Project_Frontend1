
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router,RouterLink, RouterLinkActive } from '@angular/router';
import { SelectedLoanAccountService } from '../../../features/emi/services/selected-loan-account.service';
@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule ],
  templateUrl: './customer-sidebar.html',
  styleUrl: './customer-sidebar.css'
})
export class CustomerSidebar {
  paymentsExpanded = false;
constructor(
    private router: Router,
    private selectedLoanAccountService: SelectedLoanAccountService
  ) {}

togglePayments(): void {
  this.paymentsExpanded = !this.paymentsExpanded;
}


openPaymentHistory(): void {
  const loanAccountId =
    this.selectedLoanAccountService.getLoanAccountId();

  if (loanAccountId === null || loanAccountId <= 0) {
    alert('Bhai, pehle EMI Scheduler mein Loan Account ID enter karke View Schedule karo.');
    return;
  }

  this.router.navigate(['/customer/payment-history'], {
    queryParams: { loanAccountId }
  });
}


openMyPenalty(): void {
  const loanAccountId =
    this.selectedLoanAccountService.getLoanAccountId();

  console.log('Loan Account ID from sidebar:', loanAccountId);

  if (loanAccountId === null || loanAccountId <= 0) {
    alert(
      'Pehle EMI Scheduler mein Loan Account ID enter karke View Schedule karo.'
    );
    return;
  }

  this.router.navigate(
    ['/customer/my-penalty'],
    { queryParams: { loanAccountId } }
  );
}

}
