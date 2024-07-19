import {Component, HostListener, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {AuthService} from "./service/Auth.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {IdleService} from "./service/IdleService";
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {


    constructor(private router: Router,
                private primengConfig: PrimeNGConfig,
                public authService: AuthService    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (!this.authService.isLoggedIn() && !event.url.includes('/auth/login')) {
                    this.router.navigate(['/auth/login']);
                }
            }
        });
    }

  /*
  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.authService.isLoggedIn()) {
            this.authService.logout().subscribe();
        }
    }
    */
}
