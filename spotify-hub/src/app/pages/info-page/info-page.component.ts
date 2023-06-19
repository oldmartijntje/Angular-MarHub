import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';

@Component({
    selector: 'app-info-page',
    templateUrl: './info-page.component.html',
    styleUrls: ['./info-page.component.scss']
})
export class InfoPageComponent implements OnInit {
    accessToken: string | null = null;

    constructor(private spotifyApiService: SpotifyApiService) { }

    ngOnInit(): void {
        const urlParams = new URLSearchParams(window.location.search);
        this.accessToken = urlParams.get('access_token');
        if (this.accessToken == null) {
            this.spotifyApiService.authorize()
        } else {
            this.spotifyApiService.setAccessToken(this.accessToken)
            console.log(this.spotifyApiService.getMe())
        }
    }

}
