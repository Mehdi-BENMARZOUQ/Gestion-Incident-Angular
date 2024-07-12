import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import {AuthService} from "../service/Auth.service";

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['expectedRole'];
        if (!this.authService.isLoggedIn() || !this.authService.hasRole(expectedRole)) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
