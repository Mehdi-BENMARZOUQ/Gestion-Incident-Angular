import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AgenceModule} from "./demo/components/Agence/agence.module";
import {LoginModule} from "./demo/components/auth/login/login.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RegisterModule} from "./demo/components/auth/register/register.module";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {TechnicienModule} from "./demo/components/Technicien/technicien.module";
import {UserModule} from "./demo/components/user/user.module";
import {DevisModule} from "./demo/components/Devis/devis.module";
import {FactureModule} from "./demo/components/Facture/facture.module";
import {DemandeModule} from "./demo/components/Demande/demande.module";
import {FeedbackModule} from "./demo/components/Feedback/feedback.module";
import {NotificationModule} from "./demo/components/Notification/notification.module";


@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [HttpClientModule,AppRoutingModule, AppLayoutModule,AgenceModule,LoginModule ,RegisterModule,FactureModule,DemandeModule,FeedbackModule,NotificationModule,FormsModule,BrowserModule,TechnicienModule,UserModule,DevisModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
