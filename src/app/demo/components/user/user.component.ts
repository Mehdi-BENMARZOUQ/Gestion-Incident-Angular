import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
import {UserModel} from "../../../model/user.model";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";



@Component({
    templateUrl: './user.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UserComponent implements OnInit {

    users: UserModel[] = [];
    loading: boolean = true;
    user: UserModel = {
        id: 0,
        nom:  "",
        prenom: "",
        email: "",
        role: "",
        password:"",
        notifications: [],
        devisC: [],
        demandes: [],
        handledDemandes: [],
    };
    submitted: boolean = false;
    userDialog: boolean = false;
    isNew: boolean = true;

    constructor(private userService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(): void {
        this.userService.getUsers().subscribe(
            (data: UserModel[]) => {
                this.users = data;
                this.loading = false;
            },
            (error) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    deleteUser(id: number): void {
        this.userService.deleteUser(id).subscribe(
            () => {
                this.users = this.users.filter(user => user.id !== id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            },
            (error) => {
                console.error('Delete User Error:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete User', life: 3000 });
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
        this.user = {
            id: 0,
            nom:  "",
            prenom: "",
            email: "",
            role: "",
            password:""
        };
        this.submitted = true;
        this.userDialog = true;
        this.isNew = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }


    saveUser() {
        this.submitted = true;

        if (this.user.email?.trim()) {
            this.userService.getUserByEmail(this.user.email).subscribe(
                (existingUsers) => {
                    if (existingUsers && this.isNew) {
                        Swal.fire({
                            icon: 'error',
                            title: `User ${this.user.email} Already Exists`,
                            text: `Tap "New" To Create New "User"`,
                        });
                    } else {
                        if (this.isNew) {
                            this.userService.createUser(this.user).subscribe(
                                (newUser) => {
                                    this.users.push(newUser);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `User Created Successfully`,
                                    });
                                    this.getUsers();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to create User`,
                                    });
                                }
                            );
                        } else {
                            this.userService.updateUser(this.user.id, this.user).subscribe(
                                (updatedUser) => {
                                    this.users = this.users.map(user => user.id === updatedUser.id ? updatedUser : user);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `User Updated Successfully`,
                                    });
                                    this.getUsers();
                                },
                                (error) => {
                                    console.error(error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: `Failed to update user`,
                                    });
                                }
                            );
                        }
                    }

                    this.users = [...this.users];
                    this.userDialog = false;
                    this.user = {
                        id: 0,
                        nom:  "",
                        prenom: "",
                        email: "",
                        role: "",
                        password:""
                    };
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: `Failed to check user existence`,
                    });
                }
            );
        }
    }

    editUser(user: UserModel) {
        this.user = { ...user };
        this.submitted = false;
        this.userDialog = true;
        this.isNew = false;
    }

    exportUsers() {
        const csv = Papa.unparse(this.users);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



}
