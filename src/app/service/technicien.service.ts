import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TechnicienModel} from "../model/technicien.model";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class TechnicienService {
    private apiUrl = 'http://localhost:2020';

    constructor(private http: HttpClient) { }

    getTechniciens(): Observable<TechnicienModel[]> {
        return this.http.get<TechnicienModel[]>(`${this.apiUrl}/public/technicien`);
    }

    createTechnicien(technicien: TechnicienModel): Observable<TechnicienModel> {
        return this.http.post<TechnicienModel>(`${this.apiUrl}/supervisor/savetechnicien`, technicien);
    }

    updateTechnicien(id: number, technicien: TechnicienModel): Observable<TechnicienModel> {
        return this.http.post<TechnicienModel>(`${this.apiUrl}/supervisor/updatetechnicien/${id}`, technicien);
    }

    deleteTechnicien(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/supervisor/deletetechnicien/${id}`, { responseType: 'text' })
            .pipe(
                map(response => response)
            );
    }

    getTechnicienByMatricule(name: string): Observable<TechnicienModel[]> {
        return this.http.get<TechnicienModel[]>(`${this.apiUrl}/public/technicien/matricule/${name}`);
    }
}
