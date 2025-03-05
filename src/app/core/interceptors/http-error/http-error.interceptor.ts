import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services/app-services/notification/notification.service';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Intercepts HTTP errors and handles them appropriately based on their type and status.
 * Provides user feedback through notifications and handles session expiration.
 * @param req The outgoing HTTP request
 * @param next The next handler in the interceptor chain
 * @returns An Observable of the HTTP event
 */
export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const notification = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        return handleClientError(error);
      }

      if (!navigator.onLine) {
        return handleNetworkError(error);
      }

      return handleServerError(error);
    })
  );

  /**
   * Handles client-side errors (e.g., JavaScript runtime errors)
   * @param error The HTTP error response
   * @returns An Observable that errors with the handled error
   */
  function handleClientError(error: HttpErrorResponse) {
    const message = 'Client Error: ' + (error.error.message || 'An unknown error occurred');
    return showError(error, message);
  }

  /**
   * Handles network connectivity errors
   * @param error The HTTP error response
   * @returns An Observable that errors with the handled error
   */
  function handleNetworkError(error: HttpErrorResponse) {
    return showError(error, 'Network Error: Please check your internet connection');
  }

  /**
   * Handles server-side errors based on HTTP status codes
   * Includes special handling for authentication, validation, and server errors
   * @param error The HTTP error response
   * @returns An Observable that errors with the handled error
   */
  function handleServerError(error: HttpErrorResponse) {
    const errorMessage = error.error?.message || 'An unknown error occurred';

    switch (error.status) {
      case 401:
        handleUnauthorized();
        return showError(error, 'Session expired. Please log in again.');

      case 404:
        return showError(error, `Not Found: ${errorMessage}`);

      case 400:
      case 403:
      case 422:
        return showError(error, `Request Error: ${errorMessage}`);

      case 500:
        return showError(error, `Server Error (${error.status}): ${errorMessage}`);

      default:
        return showError(
          error,
          `Unexpected Error (${error.status}): ${errorMessage}`
        );
    }
  }

  /**
   * Displays an error notification to the user and returns an error Observable
   * @param error The HTTP error response
   * @param errorMessage The message to display to the user
   * @returns An Observable that errors with the original error
   */
  function showError(error: HttpErrorResponse, errorMessage: string) {
    notification.error(errorMessage);
    return throwError(() => error);
  }

  /**
   * Handles unauthorized (401) responses by logging out the user and redirecting to login
   * Only triggers if the user is not already on the login page
   */
  function handleUnauthorized() {
    if (!router.url.includes('login')) {
      setTimeout(() => {
        notification.error('Your session has expired. Please log in again.');
      }, 100);
    }
  }
};

