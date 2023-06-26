import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { ToastQueueService } from 'src/app/services/toast-queue.service';


@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    spotifyAccessTokenStoring: boolean = true;
    colorTheme: string = 'light';

    constructor(private toastQueueService: ToastQueueService, private clipboard: Clipboard, private spotifyApiService: SpotifyApiService, private spotifyDataHandlerService: SpotifyDataHandlerService) { }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'settings');
        if (localStorage.getItem('keepSpotifyAccessToken') == null) {
            localStorage.setItem('keepSpotifyAccessToken', 'true');
        } else {
            this.spotifyAccessTokenStoring = localStorage.getItem('keepSpotifyAccessToken') == 'true';
        }
        if (localStorage.getItem('copyKeyToClipboard') != null) {
            this.retrieveToken(false)
        }
    }

    saveSettings() {
        // Code to save the settings goes here
        console.log('Settings saved');
        this.showToast('Settings saved!')
    }

    copyAcessKeyToClipboard() {
        localStorage.setItem('copyKeyToClipboard', 'true');
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        if (accessTokenURL != null) {
            this.retrieveToken(true)
        } else if (this.spotifyApiService.checkIfLoggedIn('/settings')) {
            this.retrieveToken(true)
        }
    }

    retrieveToken(byClick: boolean = true) {
        localStorage.removeItem('copyKeyToClipboard');
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        var accessTokenStorage = localStorage.getItem('spotifyAccessToken')
        if (accessTokenURL != null) {
            const textToCopy = accessTokenURL;
            this.clipboard.copy(textToCopy);
            if (byClick == false) {
                this.showToast('Didn\'t copy, Click the copy button again to copy.', "warning", 69420);
            } else {
                this.showToast('Copied Access \ntoken.')
            }
        } else if (accessTokenStorage != null) {
            const textToCopy = accessTokenStorage;
            this.clipboard.copy(textToCopy);
            if (byClick == false) {
                this.showToast('Didn\'t copy, Click the copy button again to copy.', "warning", 69420);
            } else {
                this.showToast('Copied Access \ntoken.')
            }
        } else {
            this.showToast("No token found!", "error");
        }
    }

    deleteToken(ignoreToast: boolean = false) {
        if (ignoreToast == false) {
            this.showToast('Token deleted from localStorage.')
        }
        localStorage.removeItem('spotifyAccessToken');
    }

    deleteLocalStorage() {
        this.showToast('Cleared localStorage!')
        localStorage.clear();
    }

    onCheckboxChange(newValue: boolean) {
        this.spotifyAccessTokenStoring = newValue;
        localStorage.setItem('keepSpotifyAccessToken', this.spotifyAccessTokenStoring.toString());
        console.log(this.spotifyAccessTokenStoring);
    }

    logout() {
        this.showToast('Logged out succesfully!', "info")
        this.spotifyDataHandlerService.forgetEverything()
        this.deleteToken(true)
    }

    private showToast(toastMessage: string = 'Default Toast: "Hello World!"', type: string = 'info', timeModifier: number = 0) {
        this.toastQueueService.enqueueToast(toastMessage, type, timeModifier);
    }

}
