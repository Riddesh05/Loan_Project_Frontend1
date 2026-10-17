import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedLoanAccountService {
  private loanAccountIdSubject =
    new BehaviorSubject<number | null>(null);

  setLoanAccountId(id: number): void {
    this.loanAccountIdSubject.next(id);
  }

  getLoanAccountId(): number | null {
    return this.loanAccountIdSubject.value;
  }
}