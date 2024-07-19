import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserModel} from "../model/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:2020';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/auth/supervisor/getAll`);
    }

    createUser(user: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${this.apiUrl}/auth/register`, user);
    }

    updateUser(id: number, user: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${this.apiUrl}/auth/supervisor/updateUser/${id}`, user);
    }
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/auth/supervisor/deleteUser/${id}`);
    }
    getUserByEmail(email: string): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/auth/user/email/${email}`);
    }
    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/logout`, {}, { responseType: 'text' });
    }


}
