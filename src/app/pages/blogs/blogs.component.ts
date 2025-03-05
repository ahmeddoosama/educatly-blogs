import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@core/services/app-services/notification/notification.service';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BlogsService } from '@core/services/app-services/blogs/blogs.service';
import { IBlog } from '@core/interfaces/blog.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit {

  blogs: IBlog[] = [];
  isLoading: boolean = false;
  isEmpty: boolean = true;
  skeletons: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private notificationService: NotificationService,
    private blogsService: BlogsService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  private loadBlogs(): void {
    this.isLoading = true;

    this.blogsService.getBlogs().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.isEmpty = blogs.length === 0;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.notificationService.error(error);
      }
    });
  }
}
