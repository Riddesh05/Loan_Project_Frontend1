
export interface NotificationResponse {
  notificationId: number;
  loanAccountId: number;
  emiScheduleId: number;
  notificationType: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
