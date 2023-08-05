import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DocumantationPageComponent } from './pages/documantation-page/documantation-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { PlaylistPageComponent } from './pages/playlist-page/playlist-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { SongPageComponent } from './pages/song-page/song-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { ArtistPageComponent } from './pages/artist-page/artist-page.component';

const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'docs', component: DocumantationPageComponent },
    { path: 'callback', component: CallbackPageComponent },
    { path: 'info', component: InfoPageComponent },
    { path: 'user', component: UserPageComponent },
    { path: 'settings', component: SettingsPageComponent },
    { path: 'user/:uid', component: UserPageComponent },
    { path: 'track/:id', component: SongPageComponent },
    { path: 'album/:id', component: AlbumPageComponent },
    { path: 'artist/:id', component: ArtistPageComponent },
    { path: 'search/:query', component: SearchPageComponent },
    { path: 'playlist', component: PlaylistPageComponent },
    { path: 'error', component: ErrorPageComponent },
    { path: '**', component: NotFoundPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
