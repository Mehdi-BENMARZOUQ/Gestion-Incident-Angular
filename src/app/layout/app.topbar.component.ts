import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {AuthService} from "../service/Auth.service";
import {UserModel} from "../model/user.model";
import {Observable} from "rxjs";
import {AgenceModel} from "../model/agence.model";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    user: UserModel | null = null;
    isLoggedIn: boolean;
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,private  authService: AuthService) { }

    ngOnInit(): void {
        this.checkLoginStatus();
    }

    checkLoginStatus(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        if (this.isLoggedIn) {
            this.user = this.authService.getUser();
        } else {
            this.user = null;
        }
    }



}
