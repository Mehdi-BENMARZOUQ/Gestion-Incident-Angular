import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AgenceService } from '../../../service/agence.service';
import {AgenceModel} from "../../../model/agence.model";
import {Product} from "../../api/product";
import Swal from 'sweetalert2';
//import * as Papa from 'papaparse';


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
            () => {
                this.agences = this.agences.filter(agence => agence.id !== id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Agence Deleted', life: 3000 });
            },
            (error) => {
                console.error('Delete Agence Error:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete agence', life: 3000 });
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
                        console.log(`Agence : ${existingAgences}`);
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
        //const csv = Papa.unparse(this.agences);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'agences.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


}
