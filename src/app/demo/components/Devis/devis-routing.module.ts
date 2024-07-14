import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {DevisComponent} from "./devis.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DevisComponent }
    ])],
    exports: [RouterModule]
})
export class DevisRoutingModule { }
