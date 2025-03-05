import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  INotification,
  NotificationType,
} from '@core/models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() notification!: INotification;
  @Output() close = new EventEmitter<string>();

  getIcon(type: NotificationType): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  }

  getBackgroundColor(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500';
      case 'error':
        return 'bg-red-100 border-red-500';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'info':
        return 'bg-blue-100 border-blue-500';
      default:
        return '';
    }
  }

  getTextColor(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return '';
    }
  }

  onClose(): void {
    this.close.emit(this.notification.id);
  }
}
