import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import { AgenceModel } from '../model/agence.model';
import {map} from "rxjs/operators";

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


    deleteAgence(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/supervisor/deleteagence/${id}`, { responseType: 'text' })
            .pipe(
                map(response => response)
            );
    }

    getAgenceByName(name: string): Observable<AgenceModel[]> {
        return this.http.get<AgenceModel[]>(`${this.apiUrl}/public/agence/nom/${name}`);
    }
}
