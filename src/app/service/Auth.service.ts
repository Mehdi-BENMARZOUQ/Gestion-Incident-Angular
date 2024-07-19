import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {AgenceModel} from "../model/agence.model";
import {UserModel} from "../model/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
            .pipe(map(response => {
                if (response && response.token) {
                    console.log(response);
                    localStorage.setItem('currentUser', JSON.stringify(response));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response);
                }
                return response;
            }));
    }

    register(prenom: string, email: string, password: string, role: string) {
        return this.http.post<any>(`${this.apiUrl}/auth/register`, { prenom, email, password, role })
            .pipe(
                map(response => {
                    if (response.statusCode === 200 && response.token) {
                        localStorage.setItem('currentUser', JSON.stringify(response));
                        localStorage.setItem('token', response.token);
                        this.currentUserSubject.next(response);
                    }
                    return response;
                })
            );
    }
    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    isLoggedIn() {
        return !!this.currentUserValue && !!localStorage.getItem('token');
    }

    hasRole(role: string) {
        return this.currentUserValue && this.currentUserValue.role === role;
    }

    getRole() {
        return localStorage.getItem('role');
    }
    getCurrentRole() {
        return this.currentUserValue.role;
    }

    getUser(){
         return this.currentUserValue.prenom;
    }

    clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
}
