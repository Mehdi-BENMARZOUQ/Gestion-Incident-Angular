import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {DemandeComponent} from "./demande.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DemandeComponent }
    ])],
    exports: [RouterModule]
})
export class DemandeRoutingModule { }
