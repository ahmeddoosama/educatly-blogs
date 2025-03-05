import { Component, Input } from '@angular/core';
import { IBlog } from '@core/interfaces/blog.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'blog-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css'
})
export class BlogCardComponent {
  @Input({ required: true }) blog!: IBlog;

  navigateToBlogLink(url: string) {
    window.open(url, '_blank');
  }
}
