import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {AuthService} from "./service/Auth.service";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {


    constructor(private primengConfig: PrimeNGConfig,public authService: AuthService    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
