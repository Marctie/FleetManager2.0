import { Injectable } from '@angular/core';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: Notification[] = [];
  private nextId = 1;

  /**
   * Show a success notification
   */
  success(message: string, duration: number = 3000): void {
    this.show(message, NotificationType.SUCCESS, duration);
  }

  /**
   * Show an error notification
   */
  error(message: string, duration: number = 5000): void {
    this.show(message, NotificationType.ERROR, duration);
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration: number = 4000): void {
    this.show(message, NotificationType.WARNING, duration);
  }

  /**
   * Show an informational notification
   */
  info(message: string, duration: number = 3000): void {
    this.show(message, NotificationType.INFO, duration);
  }

  /**
   * Show a generic notification
   */
  private show(message: string, type: NotificationType, duration: number): void {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type,
      duration,
    };

    this.notifications.push(notification);

    // Remove after duration ms
    setTimeout(() => {
      this.remove(notification.id);
    }, duration);
  }

  /**
   * Remove a notification
   */
  private remove(id: number): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  /**
   * Get all current notifications
   */
  getNotifications(): Notification[] {
    return this.notifications;
  }

  /**
   * Show permission denied error
   */
  showPermissionDenied(requiredRole: string): void {
    this.error(
      `Access Denied - This feature is reserved for: ${requiredRole}. Please contact an administrator.`
    );
  }

  /**
   * Show operation not allowed error
   */
  showOperationNotAllowed(operation: string): void {
    this.warning(`Operation Not Allowed - You do not have permission for: ${operation}`);
  }
}
