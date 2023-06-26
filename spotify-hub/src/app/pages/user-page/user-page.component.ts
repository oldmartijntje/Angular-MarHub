import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { Router } from '@angular/router';
import { ToastQueueService } from 'src/app/services/toast-queue.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, OnDestroy {
    accessToken: string | null = null;
    user: any;
    followingArtists: Array<any> = [];
    createdPlaylists: Array<any> = [];
    top25Songs: Array<any> = [];
    toastMessage: string = '';
    myPlaylists: Array<any> = [];
    showImage = false;
    playlistsSubscription: Subscription | null = null;

    constructor(private spotifyDataHandlerService: SpotifyDataHandlerService, public globalFunctionsService: GlobalFunctionsService) { }

    ngOnDestroy(): void {
        if (this.playlistsSubscription != null) {
            this.playlistsSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'user');
        this.waitTimeForImage(10000)
        this.spotifyDataHandlerService.getUserProfile('user').then((result) => {
            console.log(result)
            this.user = result;
        });
        this.spotifyDataHandlerService.getArtistsYouFollow('user').subscribe(
            (response) => {
                const followedArtists = response.artists.items;
                console.log(followedArtists);
                // Process the followed artists list
                this.followingArtists = followedArtists;
            },
            (error) => {
                console.error('Error retrieving followed artists:', error);
            }
        );
        this.spotifyDataHandlerService.getTop25SongsFromLast30Days('user').subscribe(
            (response) => {
                const topTracks = response.items;
                this.top25Songs = topTracks
                // this.top25Songs.forEach(element => {
                //     element['clicked'] = false;
                // });
                console.log(this.top25Songs)
            },
            (error) => {
                console.error('Error retrieving followed artists:', error);
            }
        );
        this.spotifyDataHandlerService.getMyOwnPlaylists('user').subscribe(
            (response) => {
                const playlists = response; // Assign the response directly
                this.myPlaylists = playlists; // Assign to myPlaylists
                console.log(this.myPlaylists);
                this.spotifyDataHandlerService.ownPlaylists$.subscribe((newPlaylists) => {
                    this.myPlaylists = newPlaylists;
                });
            },
            (error) => {
                console.error('Error retrieving playlists:', error);
            }
        );

    }

    isOwnUserProfileEmpty(): boolean {
        // return true
        return !this.user || Object.keys(this.user).length === 0;
    }

    waitTimeForImage(time: number = 1000) {
        setTimeout(() => {
            // Code to be executed after
            this.showImage = true
        }, time); // 1000 milliseconds = 1 second
    }

    // Call the function to wait for one second

    replaceCharecterString(input: string) {
        input = input.replace("&#x27;", "'");
        return input
    }




}
