import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FactureComponent} from "./facture.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: FactureComponent }
    ])],
    exports: [RouterModule]
})
export class FactureRoutingModule { }
