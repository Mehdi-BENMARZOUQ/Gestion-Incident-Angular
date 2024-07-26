import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../../../../service/Auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    email: string;
    password: string;
    error: string;

    constructor(private authService: AuthService, private router: Router) {}


    login(): void {
        this.authService.login(this.email, this.password).subscribe(
            response => {
                if (response.statusCode === 200) {
                    const role = this.authService.getRole();
                    if (role === 'SUPERVISOR') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Login Success',
                            text: `Welcome ${this.authService.getUser()}`,
                        });
                        this.router.navigate(['/']);
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Login Success',
                            text: `Welcome ${this.authService.getUser()}`,
                        });
                        this.router.navigate(['/']);
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Error',
                        text: response.error || 'Wrong email or password',
                    });
                }
            },
            error => {
                console.error('Error logging in', error);
            }
        );
    }
}
