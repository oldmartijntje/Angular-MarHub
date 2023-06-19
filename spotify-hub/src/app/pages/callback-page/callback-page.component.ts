import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';

@Component({
    selector: 'app-callback-page',
    templateUrl: './callback-page.component.html',
    styleUrls: ['./callback-page.component.scss']
})
export class CallbackPageComponent implements OnInit {

    constructor(private spotifyApiService: SpotifyApiService, private router: Router) { }

    ngOnInit(): void {
        this.handleAuthorizationCallback();
    }

    handleAuthorizationCallback(): void {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code || !state) {
            console.error('Authorization code or state not found.');
            return;
        }

        this.spotifyApiService.exchangeAuthorizationCode(code, state).subscribe(
            (accessToken: any) => {
                this.router.navigate(['/ussr'], { queryParams: { access_token: accessToken['access_token'] } });
            },
            (error) => {
                console.error('Error', error);
            }
        );
    }

}
