import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgenceModel } from '../model/agence.model';

@Injectable({
    providedIn: 'root'
})
export class AgenceService {
    private apiUrl = 'http://localhost:2020';

    constructor(private http: HttpClient) { }

    getAgences(): Observable<AgenceModel[]> {
        return this.http.get<AgenceModel[]>(`${this.apiUrl}/public/agence`);
    }

    createAgence(agence: AgenceModel): Observable<AgenceModel> {
        return this.http.post<AgenceModel>(`${this.apiUrl}/supervisor/saveagence`, agence);
    }

    updateAgence(id: number, agence: AgenceModel): Observable<AgenceModel> {
        return this.http.post<AgenceModel>(`${this.apiUrl}/supervisor/updateAgence/${id}`, agence);
    }

    deleteAgence(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/supervisor/deleteagence/${id}`);
    }

    getAgenceByName(name: string): Observable<AgenceModel[]> {
        return this.http.get<AgenceModel[]>(`${this.apiUrl}/public/agence/nom/${name}`);
    }
}
