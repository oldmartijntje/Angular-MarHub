import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { Router } from '@angular/router';

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
    createdPlaylists: Array<any> = [];
    top25Songs: Array<any> = [];

    constructor(private spotifyApiService: SpotifyApiService, public globalFunctionsService: GlobalFunctionsService, private router: Router) { }

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
                this.getTopTracks();
            }).catch((error) => {
                console.error(error);
                if (error.status == 403) {
                    console.error(error.error)
                    // User not registered in the Developer Dashboard
                } else if (error.status == 401) {
                    console.log(error.error.error.message)
                    this.router.navigate(['user']);
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
                this.getTopTracks();
            }).catch((error) => {
                console.error(error);
                if (error.status == 403) {
                    console.error(error.error)
                    // User not registered in the Developer Dashboard
                } else if (error.status == 401) {
                    localStorage.removeItem('spotifyAccessToken')
                    console.log(error.error.error.message)
                    this.getNewToken();
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
        // this.getPlaylists()
    }

    getTopTracks() {
        this.spotifyApiService.getTopTracks().subscribe(
            (response) => {
                const topTracks = response.items;
                this.top25Songs = topTracks
                this.top25Songs.forEach(element => {
                    element['clicked'] = false;
                });
                console.log(this.top25Songs)
            },
            (error) => {
                console.error('Error retrieving followed artists:', error);
            }
        );
    }

    addItemstoTargetList(target: Array<any>, source: Array<any>) {
        source.forEach(item => {
            target.push(item);
        });
        return target
    }

    waitOneSecond() {
        setTimeout(() => {
            // Code to be executed after one second
            this.show = true;
        }, 2000); // 1000 milliseconds = 1 second
    }

    // Call the function to wait for one second

    getPlaylists(index: number = 0) {
        const amount = 1;
        const maxNumber = 1000;
        this.spotifyApiService.getMyPlaylists(amount, index * amount).subscribe(
            (response) => {
                var playlists = response.items;
                if (playlists.length == amount) {
                    this.getPlaylists(index + 1)
                }
                this.createdPlaylists = this.addItemstoTargetList(this.createdPlaylists, playlists);
                // Process the followed artists list
                console.log(this.createdPlaylists)

            },
            (error) => {
                console.error('Error retrieving playlists:', error);
            }
        );
    }

}
