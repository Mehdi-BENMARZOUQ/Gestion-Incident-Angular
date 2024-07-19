import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FeedbackComponent} from "./feedback.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: FeedbackComponent }
    ])],
    exports: [RouterModule]
})
export class FeedbackRoutingModule { }
