import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "./Auth.service";

@Injectable({
    providedIn: 'root'
})
export class IdleService {
    private idleTime = 1200000;
    private idleTimer: any;

    constructor(
        private router: Router,
        private authService: AuthService,
        private ngZone: NgZone
    ) { }

    resetTimer() {
        console.log('Timer reset');
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
            console.log('Idle timeout reached');
            this.ngZone.run(() => {
                this.logout();
            });
        }, this.idleTime);
    }

    initIdleTimer() {
        this.resetTimer();
        ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'].forEach(evt =>
            window.addEventListener(evt, () => this.resetTimer())
        );
    }

    stopTimer() {
        clearTimeout(this.idleTimer);
    }

    private logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.router.navigate(['/auth/login']);
                });
            },
            error: (error) => {
                this.ngZone.run(() => {
                    this.router.navigate(['/auth/login']);
                });
            }
        });
    }
}
