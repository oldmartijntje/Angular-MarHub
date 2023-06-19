import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DocumantationPageComponent } from './pages/documantation-page/documantation-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'docs', component: DocumantationPageComponent },
    { path: 'callback', component: CallbackPageComponent },
    { path: 'info', component: InfoPageComponent },
    { path: 'user', component: UserPageComponent },
    { path: 'settings', component: SettingsPageComponent },
    { path: '**', component: NotFoundPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
