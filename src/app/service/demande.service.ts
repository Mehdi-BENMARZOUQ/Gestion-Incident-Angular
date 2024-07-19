import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DemandeModel} from "../model/demande.model";
import {FeedbackModel} from "../model/feedback.model";

@Injectable({
    providedIn: 'root'
})
export class DemandeService {
    private apiUrl = 'http://localhost:2020/demandes';

    constructor(private http: HttpClient) { }

    getUnreadDemandCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/unread-count`);
    }

    markAsRead(id: number): Observable<FeedbackModel> {
        return this.http.post<FeedbackModel>(`${this.apiUrl}/feedback/${id}/read`, {});
    }

    getPendingDemand(): Observable<DemandeModel[]> {
        return this.http.get<DemandeModel[]>(`${this.apiUrl}/pending`);
    }

    createDemand(demande: DemandeModel): Observable<DemandeModel> {
        return this.http.post<DemandeModel>(`${this.apiUrl}/create`, demande);
    }

    handleDemande(id: number, responseType: string, responseMessage: string): Observable<DemandeModel> {
        return this.http.post<DemandeModel>(`${this.apiUrl}/handle/${id}?responseType=${responseType}&responseMessage=${responseMessage}`, {});
    }


    getFeedbackForUser(): Observable<FeedbackModel[]> {
        return this.http.get<FeedbackModel[]>(`${this.apiUrl}/feedback`);
    }

    getAllFeedbackForUser(): Observable<FeedbackModel[]> {
        return this.http.get<FeedbackModel[]>(`${this.apiUrl}/allfeedback`);
    }

    deleteAllFeedBacks(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/deleteAllFeedbacks`, {});
    }
}
