import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
import {DemandeModel} from "../../../model/demande.model";
import {DemandeService} from "../../../service/demande.service";
import {AgenceModel} from "../../../model/agence.model";
import {AppTopBarComponent} from "../../../layout/app.topbar.component";


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './demande.component.html',
    providers: [MessageService, ConfirmationService]
})
export class DemandeComponent implements OnInit {

    demandes: DemandeModel[] = [];
    selectedDemande: DemandeModel = null;
    //feedback: DemandeResponse[] = [];

    loading: boolean = true;
    responseType: string = '';
    responseMessage: string = '';
    demande: DemandeModel = {
        type:  null,
        numero: "",
        message: "",
        description: "",
    };
    submitted: boolean = false;
    demandeDialog: boolean = false;
    isNew: boolean = true;

    constructor(private demandeService: DemandeService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getDemandes();
    }

    getDemandes(): void {
        this.demandeService.getPendingDemand().subscribe(
            (data: DemandeModel[]) => {
                this.demandes = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    getRouterLink(type: string): string {
        return type === 'Devis' ? '/devis' : '/facture';
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
            id:0,
            type:  null,
            numero: "",
            message: "",
            description: "",
        };
        this.submitted = true;
        this.demandeDialog = true;
        this.isNew = true;
    }

    hideDialog() {
        this.demandeDialog = false;
        this.submitted = false;
    }



    handleDemande() {
        if (this.demande && this.responseType && this.responseMessage) {
            this.demandeService.handleDemande(this.demande.id, this.responseType, this.responseMessage).subscribe(
                (data: DemandeModel) => {
                    Swal.fire({
                        icon: 'success',
                        title: `Demande Handled Successfully`,
                    });
                    this.getDemandes();
                    this.hideDialog();
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: `Failed to handle demande`,
                    });
                }
            );
        }
    }

    editDemande(demande: DemandeModel) {
        this.demande = { ...demande };
        this.submitted = false;
        this.demandeDialog = true;
        this.isNew = false;
    }


}
