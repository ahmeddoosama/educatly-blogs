import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NotificationService } from '@core/services/app-services/notification/notification.service';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BlogsService } from '@core/services/app-services/blogs/blogs.service';
import { IBlog } from '@core/interfaces/blog.interface';
import { finalize, Subject, throttleTime, takeUntil, catchError, of } from 'rxjs';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit, OnDestroy {

  blogPosts: IBlog[] = [];
  private currentPage = 1;
  private readonly postsPerPage = 12;
  private readonly destroy$ = new Subject<void>();
  private readonly scrollEvent$ = new Subject<void>();

  // Scroll configuration
  private readonly SCROLL_THRESHOLD_PX = 100;
  private readonly SCROLL_THROTTLE_MS = 500;
  private readonly INITIAL_PAGE = 1;

  // UI state
  isLoadingInitial: boolean = false;
  isLoadingMore: boolean = false;
  hasNoContent: boolean = false;
  errorMessage: string | null = null;
  readonly skeletonCount: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(
    private notificationService: NotificationService,
    private blogsService: BlogsService
  ) {
    this.initializeScrollHandler();
  }

  /**
   * Initializes the component by loading the first batch of blogs
   */
  ngOnInit(): void {
    this.loadBlogPosts();
  }

  /**
   * Handles window scroll events to trigger infinite scrolling
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollEvent$.next();
  }

  /**
   * Sets up the infinite scroll handler with throttling to prevent excessive API calls
   */
  private initializeScrollHandler(): void {
    this.scrollEvent$
      .pipe(
        throttleTime(this.SCROLL_THROTTLE_MS),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkAndLoadMorePosts();
      });
  }

  /**
   * Checks scroll position and loads more posts if user is near bottom of page
   */
  private checkAndLoadMorePosts(): void {
    if (this.isLoadingMore || this.hasNoContent) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition > documentHeight - this.SCROLL_THRESHOLD_PX) {
      this.loadBlogPosts();
    }
  }

  /**
   * Loads blog posts from the API with pagination
   * Handles loading states and error scenarios
   */
  private loadBlogPosts(): void {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;
    this.isLoadingInitial = this.currentPage === this.INITIAL_PAGE;
    this.errorMessage = null;

    this.blogsService.getBlogs(this.currentPage, this.postsPerPage)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.errorMessage = error?.message || 'Failed to load blog posts';
          return of([]);
        }),
        finalize(() => {
          this.isLoadingInitial = false;
          this.isLoadingMore = false;
        })
      )
      .subscribe(newPosts => {
        if (newPosts.length === 0) {
          this.hasNoContent = this.blogPosts.length === 0;
        } else {
          this.blogPosts = [...this.blogPosts, ...newPosts];
          this.currentPage++;
        }
      });
  }

  /**
   * Resets the blog list to its initial state and reloads posts
   */
  public resetBlogList(): void {
    this.blogPosts = [];
    this.currentPage = this.INITIAL_PAGE;
    this.hasNoContent = false;
    this.errorMessage = null;
    this.loadBlogPosts();
  }

  /**
   * Cleanup subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
