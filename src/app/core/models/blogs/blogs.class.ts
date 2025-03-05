export class Blog {
  private static readonly baseUrl = 'api/articles';

  static get BaseUrl(): string {
    return this.baseUrl;
  }
}
