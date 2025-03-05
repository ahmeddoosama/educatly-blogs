import { Component } from '@angular/core';
import { NotificationService } from '@core/services/app-services/notification/notification.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  constructor(private notificationService: NotificationService) {}

  testNotification() {
    this.notificationService.success('Hello World!');
  }

  testErrorNotification() {
    this.notificationService.error('Hello World!');
  }

  testWarningNotification() {
    this.notificationService.warning('Hello World!');
  }

  testInfoNotification() {
    this.notificationService.info('Hello World!');
  }
}
