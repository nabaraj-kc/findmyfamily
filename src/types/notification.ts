export type NotificationChannel = 'sms' | 'push' | 'in_app';
export type DeliveryStatus = 'queued' | 'sent' | 'delivered' | 'failed';

export interface Notification {
  id: string;
  channel: NotificationChannel;
  notificationType: string;
  caseId?: string;
  title?: string;
  body: string;
  deliveryStatus: DeliveryStatus;
  sentAt?: string;
  createdAt: string;
}
