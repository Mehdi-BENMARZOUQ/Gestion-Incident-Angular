import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import {RoleGuard} from "./guard/role.guard";
import {AgenceComponent} from "./demo/components/Agence/agence.component";
import {TechnicienComponent} from "./demo/components/Technicien/technicien.component";
import {DevisComponent} from "./demo/components/Devis/devis.component";
import {FactureComponent} from "./demo/components/Facture/facture.component";
import {DemandeComponent} from "./demo/components/Demande/demande.component";
import {FeedbackComponent} from "./demo/components/Feedback/feedback.component";
import {NotificationComponent} from "./demo/components/Notification/notification.component";
import {UserComponent} from "./demo/components/user/user.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    {
                        path: 'agence',
                        component: AgenceComponent,
                        canActivate: [RoleGuard],
                        data: { expectedRole: 'SUPERVISOR' }
                    },
                    {
                        path: 'technicien',
                        component: TechnicienComponent,
                        canActivate: [RoleGuard],
                        data: { expectedRole: 'SUPERVISOR' }
                    },
                    {
                        path: 'devis',
                        component: DevisComponent

                    },
                    {
                        path: 'facture',
                        component: FactureComponent

                    },
                    {
                        path: 'demandes',
                        component: DemandeComponent,
                        canActivate: [RoleGuard],
                        data: { expectedRole: 'SUPERVISOR' }
                    },
                    {
                        path: 'myfeedbacks',
                        component: FeedbackComponent,
                        canActivate: [RoleGuard],
                        data: { expectedRole: 'USER' }
                    },
                    {
                        path: 'notifications',
                        component: NotificationComponent
                    },
                    {
                        path: 'user',
                        component: UserComponent,
                        canActivate: [RoleGuard],
                        data: { expectedRole: 'SUPERVISOR' }
                    },
                    { path: 'dashboard', loadChildren: () => import('./demo/components/GI-Dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
