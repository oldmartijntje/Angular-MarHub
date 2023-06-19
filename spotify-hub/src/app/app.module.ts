import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SpotifyApiService } from './services/spotify-service.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './components/header/header.component';
import { DocumantationPageComponent } from './pages/documantation-page/documantation-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';


@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        HeaderComponent,
        DocumantationPageComponent,
        NotFoundPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [SpotifyApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
