import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
import {DevisModel} from "../../../model/devis.model";
import {DevisService} from "../../../service/devis.service";
import {TechnicienModel} from "../../../model/technicien.model";
import {TechnicienService} from "../../../service/technicien.service";
import {AgenceModel} from "../../../model/agence.model";
import {AgenceService} from "../../../service/agence.service";
import {FactureModel} from "../../../model/facture.model";
import {FactureService} from "../../../service/facture.service";


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './facture.component.html',
    providers: [MessageService, ConfirmationService]
})
export class FactureComponent implements OnInit {

    factures: FactureModel[] = [];
    deviss: DevisModel[] = [];
    loading: boolean = true;
    facture: FactureModel = {
        numero: "",
        date_facture : null,
        montant: 0,
        devis : {
            numero:"",
            equipementE:"",
            prestataire:"",
            montant:0,
            assurance:null,
            rejected:null,
            technicien:{nom:""},
            agence:{nom:""},
        },
    };
    submitted: boolean = false;
    factureDialog: boolean = false;
    isNew: boolean = true;

    constructor(
                private devisService: DevisService,
                private messageService: MessageService,
                private factureService: FactureService,
    ) { }

    ngOnInit(): void {
        this.getFactures();
        this.getDeviss();
    }

    getFactures(): void {
        this.factureService.getFactures().subscribe(
            (data: FactureModel[]) => {
                this.factures = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    getDeviss(): void {
        this.devisService.getDevis().subscribe(
            (data: DevisModel[]) => {
                this.deviss = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    deleteFacture(id: number): void {
        this.factureService.deleteFacture(id).subscribe(
            () => {
                this.factures = this.factures.filter(facture => facture.id !== id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facture Deleted', life: 3000 });
            },
            (error) => {
                console.error('Delete Facture Error:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete facture', life: 3000 });
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
        this.facture = {
            numero: "",
            date_facture : null,
            montant: 0,
            devis : {
                numero:"",
                equipementE:"",
                prestataire:"",
                montant:0,
                assurance:null,
                rejected:null,
                technicien:{nom:""},
                agence:{nom:""},
            },
        };
        this.submitted = true;
        this.factureDialog = true;
        this.isNew = true;
    }

    hideDialog() {
        this.factureDialog = false;
        this.submitted = false;
    }




    save() {
        this.submitted = true;

        if (this.facture.numero?.trim()) {
            this.factureService.getFactureByNumero(this.facture.numero).subscribe(
                (existingDeviss) => {
                    if (existingDeviss && this.isNew) {
                        Swal.fire({
                            icon: 'error',
                            title: `Facture ${this.facture.numero} Already Exists`,
                            text: `Tap "New" To Create New "Facture"`,
                        });
                    } else {

                        if (this.isNew) {
                            this.factureService.createFacture(this.facture).subscribe(
                                (newF) => {
                                    this.factures.push(newF);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `Devis Created Successfully`,
                                    });
                                    this.getFactures();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to create devis`,
                                    });
                                }
                            );
                        } else {
                            this.factureService.updateFacture(this.facture.id, this.facture).subscribe(
                                (updatedDevis) => {
                                    this.factures = this.factures.map(facture => facture.id === updatedDevis.id ? updatedDevis : facture);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `Facture Updated Successfully`,
                                    });
                                    this.getFactures();
                                },
                                (error) => {
                                    console.error(error);

                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to update facture`,
                                    });
                                }
                            );
                        }
                    }

                    this.factures = [...this.factures];
                    this.factureDialog = false;
                    this.facture = {
                        numero: "",
                        date_facture : null,
                        montant: 0,
                        devis : {
                            numero:"",
                            equipementE:"",
                            prestataire:"",
                            montant:0,
                            assurance:null,
                            rejected:null,
                            technicien:{nom:""},
                            agence:{nom:""},
                        },
                    };
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: `Failed to check facture existence`,
                    });
                }
            );
        }
    }


    editFacture(facture: FactureModel) {
        this.facture = { ...facture };
        this.submitted = false;
        this.factureDialog = true;
        this.isNew = false;
    }

    exportFactures() {
        const csv = Papa.unparse(this.factures);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'factures.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    importFactures(event: any) {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    results.data.forEach((data: any) => {
                        const newF: FactureModel = {
                            numero: "",
                            date_facture : null,
                            montant: 0,
                            devis : {
                                numero:"",
                                equipementE:"",
                                prestataire:"",
                                montant:0,
                                assurance:null,
                                rejected:null,
                                technicien:{nom:""},
                                agence:{nom:""},
                            },
                        };
                        this.factureService.createFacture(newF).subscribe(
                            (newF) => {
                                this.factures.push(newF);
                                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Facture Imported', life: 3000 });
                            },
                            (error) => {
                                console.error(error);
                                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to import facture', life: 3000 });
                            }
                        );
                    });
                    this.getFactures();
                }
            });
        }
    }


}
