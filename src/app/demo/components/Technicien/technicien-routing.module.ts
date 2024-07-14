import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {TechnicienComponent} from "./technicien.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TechnicienComponent }
    ])],
    exports: [RouterModule]
})
export class TechnicienRoutingModule { }
