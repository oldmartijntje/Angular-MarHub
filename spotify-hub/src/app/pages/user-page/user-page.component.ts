import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { Router } from '@angular/router';
import { ToastQueueService } from 'src/app/services/toast-queue.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
    accessToken: string | null = null;
    user: any;
    followingArtists: Array<any> = [];
    createdPlaylists: Array<any> = [];
    top25Songs: Array<any> = [];
    toastMessage: string = '';

    constructor(private spotifyDataHandlerService: SpotifyDataHandlerService, public globalFunctionsService: GlobalFunctionsService) { }

    ngOnInit(): void {
        this.spotifyDataHandlerService.getUserProfile('user').then((result) => {
            console.log(result)
            this.user = result
        })
    }

    isOwnUserProfileEmpty(): boolean {
        return !this.user || Object.keys(this.user).length === 0;
    }

    waitOneSecond() {
        setTimeout(() => {
            // Code to be executed after one second
        }, 2000); // 1000 milliseconds = 1 second
    }

    // Call the function to wait for one second




}
