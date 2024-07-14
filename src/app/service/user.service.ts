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
        return this.http.get<UserModel[]>(`${this.apiUrl}/supervisor/user`);
    }

    createUser(user: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${this.apiUrl}/supervisor/saveUser`, user);
    }

    updateUser(id: number, user: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${this.apiUrl}/supervisor/updateteuser/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/supervisor/deleteuser/${id}`);
    }

    getUserByEmail(email: string): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/supervisor/user/email/${email}`);
    }
}
