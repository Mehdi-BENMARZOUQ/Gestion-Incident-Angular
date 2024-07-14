import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TechnicienService } from '../../../service/technicien.service';
import {TechnicienModel} from "../../../model/technicien.model";
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './technicien.component.html',
    providers: [MessageService, ConfirmationService]
})
export class TechnicienComponent implements OnInit {

    techniciens: TechnicienModel[] = [];
    loading: boolean = true;
    technicien: TechnicienModel = {
        id:0,
        matricule:"",
        nom:""
    };
    submitted: boolean = false;
    technicienDialog: boolean = false;
    isNew: boolean = true;

    constructor(private technicienService: TechnicienService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getTechniciens();
    }

    getTechniciens(): void {
        this.technicienService.getTechniciens().subscribe(
            (data: TechnicienModel[]) => {
                this.techniciens = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    deleteTechnicien(id: number): void {
        this.technicienService.deleteTechnicien(id).subscribe(
            () => {
                this.techniciens = this.techniciens.filter(technicien => technicien.id !== id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technicien Deleted', life: 3000 });
            },
            (error) => {
                console.error('Delete Technicien Error:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Technicien', life: 3000 });
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
        this.technicien = {
            id:0,
            matricule:"",
            nom:""
        };
        this.submitted = true;
        this.technicienDialog = true;
        this.isNew = true;

    }

    hideDialog() {
        this.technicienDialog = false;
        this.submitted = false;
    }


    saveProduct() {
        this.submitted = true;

        if (this.technicien.matricule?.trim()) {
            this.technicienService.getTechnicienByMatricule(this.technicien.matricule).subscribe(
                (existingTechniciens) => {
                    console.log(`Technicien : ${existingTechniciens}`);
                    if (existingTechniciens && this.isNew) {
                        Swal.fire({
                            icon: 'error',
                            title: `Technicien ${this.technicien.matricule} Already Exists`,
                            text: `Tap "New" To Create New "Technicien"`,
                        });
                    } else {
                        if (this.isNew) {
                            this.technicienService.createTechnicien(this.technicien).subscribe(
                                (newTechnicien) => {
                                    this.techniciens.push(newTechnicien);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `Technicien Created Successfully`,
                                    });
                                    this.getTechniciens();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to create technicien`,
                                    });
                                }
                            );
                        } else {
                            this.technicienService.updateTechnicien(this.technicien.id, this.technicien).subscribe(
                                (updatedTechnicien) => {
                                    this.techniciens = this.techniciens.map(technicien => technicien.id === updatedTechnicien.id ? updatedTechnicien : technicien);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `Technicien Updated Successfully`,
                                    });
                                    this.getTechniciens();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to update technicien`,
                                    });
                                }
                            );
                        }
                    }

                    this.techniciens = [...this.techniciens];
                    this.technicienDialog = false;
                    this.technicien = {
                        id:0,
                        matricule:"",
                        nom:""
                    };
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: `Failed to check technicien existence`,
                    });
                }
            );
        }
    }

    editTechnicien(technicien: TechnicienModel) {
        this.technicien = { ...technicien };
        this.submitted = false;
        this.technicienDialog = true;
        this.isNew = false;
    }

    exportTechniciens() {
        const csv = Papa.unparse(this.techniciens);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'techniciens.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    importATechniciens(event: any) {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    results.data.forEach((data: any) => {
                        const newTechnicien: TechnicienModel = {
                            id: data.id,
                            matricule: data.matricule,
                            nom: data.nom
                        };
                        this.technicienService.createTechnicien(newTechnicien).subscribe(
                            (newTechnicien) => {
                                this.techniciens.push(newTechnicien);
                                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Techniciens Imported', life: 3000 });
                            },
                            (error) => {
                                console.error(error);
                                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to import technicien', life: 3000 });
                            }
                        );
                    });
                    this.getTechniciens();
                }
            });
        }
    }

}
