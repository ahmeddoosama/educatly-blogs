import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NotificationService } from '@core/services/app-services/notification/notification.service';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BlogsService } from '@core/services/app-services/blogs/blogs.service';
import { IBlog } from '@core/interfaces/blog.interface';
import { finalize, Subject, throttleTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit, OnDestroy {

  blogs: IBlog[] = [];
  isLoading: boolean = false;
  isEmpty: boolean = false;
  skeletons: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  isLoadingMore = false;

  private page = 1;
  private pageSize = 12;
  private destroy$ = new Subject<void>();
  private scroll$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private blogsService: BlogsService
  ) {
    // Setup throttled scroll handler
    this.scroll$
      .pipe(
        throttleTime(500), // Throttle to once every 500ms
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadMoreIfNeeded();
      });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scroll$.next();
  }

  private loadMoreIfNeeded(): void {
    if (this.isLoadingMore) return;

    const threshold = 100; // pixels from bottom
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold) {
      this.loadBlogs();
    }
  }

  private loadBlogs(): void {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;
    this.isLoading = this.page === 1;

    this.blogsService.getBlogs(this.page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newBlogs) => {
          if (newBlogs.length === 0) {
            this.isEmpty = this.blogs.length === 0;
          } else {
            this.blogs = [...this.blogs, ...newBlogs];
            this.page++;
          }
          this.isLoading = false;
          this.isLoadingMore = false;
        },
        error: (error) => {
          console.error('Error loading blogs:', error);
          this.notificationService.error(error);
          this.isLoading = false;
          this.isLoadingMore = false;
        }
      });
  }
}
