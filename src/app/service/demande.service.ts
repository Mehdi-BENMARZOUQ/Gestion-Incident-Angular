import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgenceModel } from '../model/agence.model';

@Injectable({
    providedIn: 'root'
})
export class DemandeService {
    private apiUrl = 'http://localhost:2020/public/agence';

    constructor(private http: HttpClient) { }

    getAgences(): Observable<AgenceModel[]> {
        return this.http.get<AgenceModel[]>(this.apiUrl);
    }

    createAgence(agence: AgenceModel): Observable<AgenceModel> {
        return this.http.post<AgenceModel>(this.apiUrl, agence);
    }

    updateAgence(id: number, agence: AgenceModel): Observable<AgenceModel> {
        return this.http.put<AgenceModel>(`${this.apiUrl}/${id}`, agence);
    }

    deleteAgence(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
