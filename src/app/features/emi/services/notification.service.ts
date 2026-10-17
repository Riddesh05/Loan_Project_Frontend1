
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NotificationResponse } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8081/api/notifications';

  getNotifications(loanAccountId: number) {
    return this.http.get<NotificationResponse[]>(
      `${this.apiUrl}/loan-account/${loanAccountId}`,
      { timeout: 10000 }
    );
  }

  markAsRead(notificationId: number) {
    return this.http.patch<NotificationResponse>(
      `${this.apiUrl}/read`,
      { notificationId },
      { timeout: 10000 }
    );
  }
}
