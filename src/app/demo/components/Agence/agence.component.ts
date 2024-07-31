import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AgenceService } from '../../../service/agence.service';
import {AgenceModel} from "../../../model/agence.model";
import {Product} from "../../api/product";
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../service/Auth.service";


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './agence.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AgenceComponent implements OnInit {

    agences: AgenceModel[] = [];
    loading: boolean = true;
    agence: AgenceModel = {
        id:0,
        nom:""
    };
    submitted: boolean = false;
    agenceDialog: boolean = false;
    isNew: boolean = true;

    constructor(private agenceService: AgenceService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getAgences();
    }

    getAgences(): void {
        this.agenceService.getAgences().subscribe(
            (data: AgenceModel[]) => {
                this.agences = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    deleteAgence(id: number): void {
        this.agenceService.deleteAgence(id).subscribe(
            (response) => {
                if (response === "Done") {
                    this.agences = this.agences.filter(agence => agence.id !== id);
                    Swal.fire({
                        icon: 'success',
                        title: 'Agence supprimée avec succès',
                    });
                    this.getAgences();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur lors de la suppression',
                        text: 'Une erreur inattendue s\'est produite.',
                    });
                }
            },
            (error) => {
                if(error.error === "Cette agence est liee aux devis"){
                    Swal.fire({
                        icon: 'error',
                        title: `Impossible de supprimer l\\'agence`,
                        text: `Cette agence est liée à des devis. Veuillez d\\'abord supprimer ces devis."`,
                    });
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: "Erreur lors de la suppression",
                        text: 'Une erreur inattendue s\'est produite.',
                    });
                    this.getAgences();
                }
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
        this.agence = {
            id:0,
            nom:""
        };
        this.submitted = true;
        this.agenceDialog = true;
        this.isNew = true;
    }

    hideDialog() {
        this.agenceDialog = false;
        this.submitted = false;
    }


    saveProduct() {
        this.submitted = true;

        if (this.agence.nom?.trim()) {
            this.agenceService.getAgenceByName(this.agence.nom).subscribe(
                    (existingAgences) => {
                    if (existingAgences && this.isNew) {
                        Swal.fire({
                            icon: 'error',
                            title: `Agence ${this.agence.nom} Already Exists`,
                            text: `Tap "New" To Create New "Agence"`,
                        });
                    } else {
                        if (this.isNew) {
                            this.agenceService.createAgence(this.agence).subscribe(
                                (newAgence) => {
                                    this.agences.push(newAgence);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `Agence Created Successfully`,
                                    });
                                    this.getAgences();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to create agence`,
                                    });
                                }
                            );
                        } else {
                            this.agenceService.updateAgence(this.agence.id, this.agence).subscribe(
                                (updatedAgence) => {
                                    this.agences = this.agences.map(agence => agence.id === updatedAgence.id ? updatedAgence : agence);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `Agence Updated Successfully`,
                                    });
                                    this.getAgences();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to update agence`,
                                    });
                                }
                            );
                        }
                    }

                    this.agences = [...this.agences];
                    this.agenceDialog = false;
                    this.agence = {
                        id: 0,
                        nom: ""
                    };
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: `Failed to check agence existence`,
                    });
                }
            );
        }
    }

    editAgence(agence: AgenceModel) {
        this.agence = { ...agence };
        this.submitted = false;
        this.agenceDialog = true;
        this.isNew = false;
    }

    exportAgences() {
        const csv = Papa.unparse(this.agences);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'agences.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    exportAgencesPDF() {
        const doc = new jsPDF();
        // @ts-ignore
        doc.autoTable({
            head: [['ID', 'Nom']],
            body: this.agences.map(agence => [
                agence.id,
                agence.nom
            ]),
            startY: 20,
            margin: { horizontal: 10 },
            styles: {
                fontSize: 10,
                cellPadding: 5,
                overflow: 'linebreak',
                halign: 'left',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [41, 128, 185]
            },
            footStyles: {
                fillColor: [41, 128, 185]
            },
            tableWidth: 'auto',
        });

        doc.save('agences.pdf');
    }


}
