import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INotification, NotificationPosition, NotificationType } from '@core/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /** BehaviorSubject to store and manage the list of active notifications */
  private notifications = new BehaviorSubject<INotification[]>([]);
  /** BehaviorSubject to store and manage the current position of notifications */
  private position = new BehaviorSubject<NotificationPosition>('top-right');

  /** Observable stream of notifications array */
  notifications$ = this.notifications.asObservable();
  /** Observable stream of notification position */
  position$ = this.position.asObservable();

  /**
   * Shows a notification with specified message, type and duration
   * @param message - The text content of the notification
   * @param type - The type of notification ('success', 'error', 'warning', 'info')
   * @param duration - Time in milliseconds before the notification auto-dismisses. Set to 0 for persistent notification
   */
  show(message: string, type: NotificationType, duration: number = 5000): void {
    const id = Date.now().toString();
    const notification: INotification = {
      id,
      message,
      type,
      duration
    };

    this.notifications.next([...this.notifications.value, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  /**
   * Shows a success notification
   * @param message - The success message to display
   * @param duration - Optional duration in milliseconds (defaults to 5000)
   */
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Shows an error notification
   * @param message - The error message to display
   * @param duration - Optional duration in milliseconds (defaults to 5000)
   */
  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Shows a warning notification
   * @param message - The warning message to display
   * @param duration - Optional duration in milliseconds (defaults to 5000)
   */
  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Shows an info notification
   * @param message - The info message to display
   * @param duration - Optional duration in milliseconds (defaults to 5000)
   */
  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  /**
   * Removes a specific notification by its ID
   * @param id - The unique identifier of the notification to remove
   */
  remove(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter(notification => notification.id !== id));
  }

  /**
   * Sets the position where notifications will appear
   * @param position - The desired position ('top-left', 'top-right', 'bottom-left', 'bottom-right')
   */
  setPosition(position: NotificationPosition): void {
    this.position.next(position);
  }

  /**
   * Removes all current notifications
   */
  clear(): void {
    this.notifications.next([]);
  }
}
