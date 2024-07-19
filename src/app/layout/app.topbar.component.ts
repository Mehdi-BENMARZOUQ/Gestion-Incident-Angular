import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {AuthService} from "../service/Auth.service";
import {DemandeService} from "../service/demande.service";
import {FeedbackModel} from "../model/feedback.model";
import {NotificationModel} from "../model/notification.model";
import {NotificationService} from "../service/notification.service";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {IdleService} from "../service/IdleService";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {


    feedbacks: FeedbackModel[] = [];
    feedbackCount: number = 0;
    unreadDemandCount: number = 0;
    unreadNotificationCount: number = 0;
    items!: MenuItem[];
    user: string | null = null;
    userRole: string | null = null;
    isLoggedIn: boolean;
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(private idleService: IdleService,
                private userService: UserService,
                private router: Router,
                public layoutService: LayoutService,
                private  authService: AuthService,
                private demandeService: DemandeService,
                public notificationService: NotificationService) { }

    ngOnInit(): void {
        this.checkLoginStatus();
        this.getUnreadDemandCount();
        this.getFeedback();
        this.getUnreadNotificationCount();
        this.allItems();

    }

    ngOnDestroy() {
        this.idleService.stopTimer();
    }

    allItems(){
        this.items = [
            {
                label: this.user,
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.logout(),
                    }
                ]
            },
        ];
    }

    checkLoginStatus(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        if (this.isLoggedIn) {
            this.user = this.authService.getUser();
            this.userRole = this.authService.getCurrentRole();
        } else {
            this.user = null;
            this.userRole = null;
        }
    }

    getUnreadDemandCount(): void {
        this.demandeService.getUnreadDemandCount().subscribe(
            (count: number) => {
                this.unreadDemandCount = count;
            },
            (error) => {
                console.error('Failed to fetch unread demand count:', error);
            }
        );
    }

    getFeedback(): void {
        this.demandeService.getFeedbackForUser().subscribe(
            (data: FeedbackModel[]) => {
                this.feedbacks = data;
                this.feedbackCount = data.filter(feedback => !feedback.read).length;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    getUnreadNotificationCount(): void {
        this.notificationService.getUnreadNotifications().subscribe(
            (notifications: NotificationModel[]) => {
                this.unreadNotificationCount = notifications.length;
            },
            (error) => {
                console.error('Failed to fetch unread notification count:', error);
            }
        );
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: () => {
                console.log('Logout successful');
                this.router.navigate(['/auth/login']);
            },
            error: (error) => {
                console.error('Logout failed:', error);
                // Even if logout fails, redirect to login page
                this.router.navigate(['/auth/login']);
            }
        });
    }
}
