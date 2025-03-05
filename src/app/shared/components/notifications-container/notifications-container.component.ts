import { Component, OnInit } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '@core/services/app-services/notification/notification.service';
import {
  INotification,
  NotificationPosition,
} from '@core/models/notification.model';

@Component({
  selector: 'app-notifications-container',
  standalone: true,
  imports: [NotificationComponent],
  template: `
    <div [class]="getPositionClasses()">
      @for (notification of notifications; track notification.id) {
      <app-notification
        [notification]="notification"
        (close)="onNotificationClose($event)"
      ></app-notification>
      }
    </div>
  `,
})
export class NotificationsContainerComponent implements OnInit {
  notifications: INotification[] = [];
  position: NotificationPosition = 'top-right';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
    this.notificationService.position$.subscribe((position) => {
      this.position = position;
    });
  }

  getPositionClasses(): string {
    const baseClasses = 'fixed z-50 p-4 space-y-4 w-96';
    switch (this.position) {
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      default:
        return `${baseClasses} top-0 right-0`;
    }
  }

  onNotificationClose(id: string): void {
    this.notificationService.remove(id);
  }
}
