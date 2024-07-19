import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from "../service/Auth.service";

@Injectable({
    providedIn: 'root'
})
export class SupervisorGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isLoggedIn() && this.authService.getRole() === 'SUPERVISOR') {
            return true;
        } else {
            this.router.navigate(['/dashboard']);
            return false;
        }
    }
}
