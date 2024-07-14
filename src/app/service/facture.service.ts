import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {FactureModel} from "../model/facture.model";

@Injectable({
    providedIn: 'root'
})
export class FactureService {
    private apiUrl = 'http://localhost:2020';

    constructor(private http: HttpClient) { }

    getFactures(): Observable<FactureModel[]> {
        return this.http.get<FactureModel[]>(`${this.apiUrl}/public/facture`);
    }

    createFacture(facture: FactureModel): Observable<FactureModel> {
        return this.http.post<FactureModel>(`${this.apiUrl}/public/saveFacture`, facture);
    }

    updateFacture(id: number, facture: FactureModel): Observable<FactureModel> {
        return this.http.post<FactureModel>(`${this.apiUrl}/supervisor/updateFacture/${id}`, facture);
    }

    deleteFacture(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/supervisor/deleteFacture/${id}`);
    }

    getFactureByNumero(numero: string): Observable<FactureModel[]> {
        return this.http.get<FactureModel[]>(`${this.apiUrl}/public/facture/numero/${numero}`);
    }

}
