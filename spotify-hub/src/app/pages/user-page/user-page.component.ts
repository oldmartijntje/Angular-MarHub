import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
    accessToken: string | null = null;
    loadedUser = false;
    user: any;

    constructor(private spotifyApiService: SpotifyApiService) { }

    ngOnInit(): void {
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        if (accessTokenURL != null) {
            this.spotifyApiService.setAccessToken(accessTokenURL);
            this.spotifyApiService.getMe().then((result) => {
                this.user = result;
                this.loadedUser = true;
                console.log(this.user);
            }).catch((error) => {
                console.error(error);
            });
        } else if (this.spotifyApiService.checkIfLoggedIn('/user')) {
            console.log('piss');
            this.spotifyApiService.getMe().then((result) => {
                this.user = result;
                this.loadedUser = true;
                console.log(this.user);
            }).catch((error) => {
                console.error(error);
            });
        }
    }
}
