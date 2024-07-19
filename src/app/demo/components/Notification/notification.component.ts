import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
import {DemandeModel} from "../../../model/demande.model";
import {DemandeService} from "../../../service/demande.service";
import {AgenceModel} from "../../../model/agence.model";
import {AppTopBarComponent} from "../../../layout/app.topbar.component";
import {NotificationModel} from "../../../model/notification.model";
import {NotificationService} from "../../../service/notification.service";


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './notification.component.html',
    providers: [MessageService, ConfirmationService]
})
export class NotificationComponent implements OnInit {

    notifications: NotificationModel[] = [];
    loading: boolean = true;

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.loadNotifications();
    }

    loadNotifications(): void {
        this.notificationService.getUnreadNotifications().subscribe(
            (data: NotificationModel[]) => {
                this.notifications = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    markAsRead(notification: NotificationModel): void {
        this.notificationService.markAsRead(notification.id).subscribe(
            () => {
                notification.read = true;
                this.notifications = this.notifications.filter(n => n.id !== notification.id);
            },
            (error) => {
                console.error('Failed to mark notification as read:', error);
            }
        );
    }

    deleteNotification(notification: NotificationModel): void {
        this.notificationService.deleteNotification(notification.id).subscribe(
            () => {
                this.notifications = this.notifications.filter(n => n.id !== notification.id);
            },
            (error) => {
                console.error('Failed to delete notification:', error);
            }
        );
    }

    deleteAllNotifications(): void {
        this.notificationService.deleteAllNotifications().subscribe(
            () => {
                this.notifications = [];
            },
            (error) => {
                console.error('Failed to delete all notifications:', error);
            }
        );
    }


}
