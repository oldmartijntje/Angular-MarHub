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
                if (localStorage.getItem('keepSpotifyAccessToken') == 'true' || localStorage.getItem('keepSpotifyAccessToken') == null) {
                    // console.log(accessToken)
                    localStorage.setItem('spotifyAccessToken', accessToken['access_token']);
                    localStorage.setItem('spotifyRefreshToken', accessToken['refresh_token']);
                    if (localStorage.getItem('currentPage') == 'playlist') {
                        this.router.navigate([localStorage.getItem('currentPage')], { queryParams: { "playlistId": localStorage.getItem('pageVariation') } });
                    } else if (localStorage.getItem('currentPage') == 'search') {
                        this.router.navigate([localStorage.getItem('currentPage'), localStorage.getItem('pageVariation')]);
                    } else if (localStorage.getItem('currentPage') == 'user') {
                        this.router.navigate([localStorage.getItem('currentPage'), localStorage.getItem('pageVariation')]);
                    } else {
                        this.router.navigate([localStorage.getItem('currentPage')]);
                    }
                } else {
                    if (localStorage.getItem('currentPage') == 'playlist') {
                        this.router.navigate([localStorage.getItem('currentPage')], { queryParams: { "playlistId": localStorage.getItem('pageVariation'), "access_token": accessToken['access_token'] } });
                    } else if (localStorage.getItem('currentPage') == 'search') {
                        this.router.navigate([localStorage.getItem('currentPage'), localStorage.getItem('pageVariation')], { queryParams: { "access_token": accessToken['access_token'] } });
                    } else if (localStorage.getItem('currentPage') == 'user') {
                        this.router.navigate([localStorage.getItem('currentPage'), localStorage.getItem('pageVariation')], { queryParams: { "access_token": accessToken['access_token'] } });
                    } else {
                        this.router.navigate([localStorage.getItem('currentPage')], { queryParams: { "access_token": accessToken['access_token'] } });
                    }
                }

            },
            (error) => {
                console.error('Error', error);
            }
        );
    }

}
