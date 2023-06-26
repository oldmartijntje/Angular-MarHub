import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SpotifyApiService } from './services/spotify-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './components/header/header.component';
import { DocumantationPageComponent } from './pages/documantation-page/documantation-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { MenuPopupComponent } from './components/menu-popup/menu-popup.component';
import { ToastPopupComponent } from './components/toast-popup/toast-popup.component';
import { PlaylistPageComponent } from './pages/playlist-page/playlist-page.component';


@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        HeaderComponent,
        DocumantationPageComponent,
        NotFoundPageComponent,
        CallbackPageComponent,
        InfoPageComponent,
        UserPageComponent,
        SettingsPageComponent,
        MenuPopupComponent,
        ToastPopupComponent,
        PlaylistPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [SpotifyApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
