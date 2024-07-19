import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import {FeedbackModel} from "../../../model/feedback.model";
import {DemandeService} from "../../../service/demande.service";
import {DemandeModel} from "../../../model/demande.model";


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './feedback.component.html',
    providers: [MessageService, ConfirmationService]
})
export class FeedbackComponent implements OnInit {

    feedbacks: FeedbackModel[] = [];
    demandes: DemandeModel[] = [];
    loading: boolean = true;
    responseType: string = '';
    responseMessage: string = '';
    feedback: FeedbackModel = {
        status: "",
        responseMessage: "",
        read: false
    };
    demande: DemandeModel = {
        type: null,
        numero: "",
        message: "",
        description: "",
        read: false
    }
    submitted: boolean = false;
    feedbackDialog: boolean = false;
    isNew: boolean = true;

    constructor(private demandeService: DemandeService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getFeedbacks();
    }

    getFeedbacks(): void {
        this.demandeService.getAllFeedbackForUser().subscribe(
            (data: FeedbackModel[]) => {
                this.feedbacks = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }




    @ViewChild('filter') filter!: ElementRef;
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    openNew() {
        this.demande = {
            type: null,
            numero: "",
            message: "",
            description: "",
            read: false
        };
        this.submitted = true;
        this.feedbackDialog = true;
        this.isNew = true;
    }

    hideDialog() {
        this.feedbackDialog = false;
        this.submitted = false;
    }



    createDemande(){
        this.submitted = true;
        this.demandeService.createDemand(this.demande).subscribe(
        (newAgence) => {
            this.demandes.push(newAgence);
            Swal.fire({
                icon: 'success',
                title: `Demand Sent Successfully`,
            });
            this.getFeedbacks();
        },
        (error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: `Failed to send demande`,
            });
        }
    );
        this.demandes = [...this.demandes];
        this.feedbackDialog = false;
        this.demande = {
            type: null,
            numero: "",
            message: "",
            description: "",
            read: false
        };
    }

    markAsRead(feedback: FeedbackModel): void {
        this.demandeService.markAsRead(feedback.id).subscribe(
            () => {
                feedback.read = true;
                this.feedbacks = [...this.feedbacks];
            },
            (error) => {
                console.error('Failed to mark feedback as read:', error);
            }
        );
    }

    deleteAllFeedBacks(): void {
        this.demandeService.deleteAllFeedBacks().subscribe(
            () => {
                this.feedbacks = [];
            },
            (error) => {
                console.error('Failed to delete all notifications:', error);
            }
        );
    }


}
