import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
    accessToken: string | null = null;
    loadedUser = false;
    user: any;
    followingArtists: Array<any> = [];
    show = false;

    constructor(private spotifyApiService: SpotifyApiService, public globalFunctionsService: GlobalFunctionsService) { }

    ngOnInit(): void {
        this.getNewToken()
        this.waitOneSecond();
    }

    getNewToken() {
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        if (accessTokenURL != null) {
            this.spotifyApiService.setAccessToken(accessTokenURL);
            this.spotifyApiService.getMe().then((result) => {
                this.user = result;
                this.loadedUser = true;
                console.log(this.user);
                this.getFollowing();
            }).catch((error) => {
                console.error(error);
                if (error.status == 403) {
                    console.error(error.error)
                } else if (error.status == 401) {
                    // this.getNewToken();
                    // outdated token
                    // should also remove params before trying again
                }
            });
        } else if (this.spotifyApiService.checkIfLoggedIn('/user')) {
            console.log('piss');
            this.spotifyApiService.getMe().then((result) => {
                this.user = result;
                this.loadedUser = true;
                console.log(this.user);
                this.getFollowing();
            }).catch((error) => {
                console.error(error);
                if (error.status == 403) {
                    console.error(error.error)
                } else if (error.status == 401) {
                    localStorage.removeItem('spotifyAccessToken')
                    // this.getNewToken();
                    // outdated token
                }
            });
        }
    }

    getFollowing() {
        this.spotifyApiService.getFollowedArtists().subscribe(
            (response) => {
                const followedArtists = response.artists.items;
                console.log(followedArtists)
                // Process the followed artists list
                this.followingArtists = followedArtists;
            },
            (error) => {
                console.error('Error retrieving followed artists:', error);
            }
        );
    }

    waitOneSecond() {
        setTimeout(() => {
            // Code to be executed after one second
            this.show = true;
        }, 2000); // 1000 milliseconds = 1 second
    }

    // Call the function to wait for one second

}
