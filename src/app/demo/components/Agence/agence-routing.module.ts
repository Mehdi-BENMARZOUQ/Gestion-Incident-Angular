import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgenceComponent } from './agence.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AgenceComponent }
    ])],
    exports: [RouterModule]
})
export class AgenceRoutingModule { }
