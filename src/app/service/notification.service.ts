import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {NotificationModel} from "../model/notification.model";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:2020/api/notifications';

    constructor(private http: HttpClient) { }

    getUnreadNotifications(): Observable<NotificationModel[]> {
        return this.http.get<NotificationModel[]>(`${this.apiUrl}`);
    }

    markAsRead(notificationId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${notificationId}/mark-as-read`, {});
    }

    deleteNotification(notificationId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
    }

    deleteAllNotifications(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}`, {});
    }
}
