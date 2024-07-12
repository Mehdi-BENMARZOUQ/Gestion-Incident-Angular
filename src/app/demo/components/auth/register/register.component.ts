import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../../service/Auth.service";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegisterComponent {
    prenom: string = '';
    email: string = '';
    password: string = '';
    role: string = 'USER';
    errorMessage: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    register() {
        this.errorMessage = '';

        this.authService.register(this.prenom, this.email, this.password, this.role).subscribe(
            response => {
                if (response.statusCode === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Error',
                        text: response.error || 'Email already in use. Please choose a different email.',
                    });
                    /*this.errorMessage = response.error || 'Registration failed. Please try again.';*/
                } else if (response.statusCode === 200 && response.token) {
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/dashboard']);
                } else {
                    /*this.errorMessage = 'An unexpected error occurred. Please try again.';*/
                    Swal.fire({
                        icon: 'error',
                        title: 'Unexpected Error',
                        text: 'An unexpected error occurred. Please try again.',
                    });
                }
            },
            error => {
                console.error('Registration error', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Error',
                    text: 'An error occurred during registration. Please try again.',
                });
            }
        );
    }
}
