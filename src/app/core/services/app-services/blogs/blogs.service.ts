import { Injectable } from '@angular/core';
import { IBlog } from '@core/interfaces/blog.interface';
import { Blog } from '@core/models/blogs/blogs.class';
import { CoreRequestService } from '@core/services/api-services/core-request/core-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor(
    private coreRequest: CoreRequestService
  ) { }


  /**
   * Get blogs
   * @param
   * @returns Observable of blog array
   */
  getBlogs(): Observable<IBlog[]> {
    return this.coreRequest.get(Blog.BaseUrl);
  }
}
