import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';


@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    spotifyAccessTokenStoring: boolean = true;
    colorTheme: string = 'light';

    constructor(private clipboard: Clipboard, private spotifyApiService: SpotifyApiService) { }

    ngOnInit(): void {
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
                alert('click the copy button again.');
            }
        } else if (accessTokenStorage != null) {
            const textToCopy = accessTokenStorage;
            this.clipboard.copy(textToCopy);
            if (byClick == false) {
                alert('click the copy button again.');
            }
        } else {
            alert("No token found!");
        }
    }

    deleteToken() {
        localStorage.removeItem('spotifyAccessToken');
    }

    deleteLocalStorage() {
        localStorage.clear();
    }

    onCheckboxChange(newValue: boolean) {
        this.spotifyAccessTokenStoring = newValue;
        localStorage.setItem('keepSpotifyAccessToken', this.spotifyAccessTokenStoring.toString());
        console.log(this.spotifyAccessTokenStoring);
    }

}
