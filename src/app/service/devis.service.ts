import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {DevisModel} from "../model/devis.model";

@Injectable({
    providedIn: 'root'
})
export class DevisService {
    private apiUrl = 'http://localhost:2020';

    constructor(private http: HttpClient) { }

    getDevis(): Observable<DevisModel[]> {
        return this.http.get<DevisModel[]>(`${this.apiUrl}/public/devis`);
    }

    createDevis(devis: DevisModel): Observable<DevisModel> {
        return this.http.post<DevisModel>(`${this.apiUrl}/public/savedevis`, devis);
    }

    updateDevis(id: number, devis: DevisModel): Observable<DevisModel> {
        return this.http.post<DevisModel>(`${this.apiUrl}/supervisor/updatedevis/${id}`, devis);
    }

    deleteDevis(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/supervisor/deletedevis/${id}`);
    }

    getDevisByNumero(numero: string): Observable<DevisModel[]> {
        return this.http.get<DevisModel[]>(`${this.apiUrl}/public/devis/numero/${numero}`);
    }

}
