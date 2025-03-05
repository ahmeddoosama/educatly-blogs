export type NotificationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface INotification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
  position?: NotificationPosition;
}
