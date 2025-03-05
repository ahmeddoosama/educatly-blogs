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
  getBlogs(page: number, pageSize: number): Observable<IBlog[]> {
    const data: { page: number, per_page: number } = {
      page: page ?? 1,
      per_page: pageSize ?? 12
    };
    return this.coreRequest.get(Blog.BaseUrl, data);
  }
}
