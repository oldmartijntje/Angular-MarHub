import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
    accessToken: string | null = null;

    constructor(private spotifyApiService: SpotifyApiService) { }

    ngOnInit(): void {
        if (this.spotifyApiService.checkIfLoggedIn('/user')) {
            console.log('piss')
            console.log(this.spotifyApiService.getMe())
        }
    }
}
