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
    imageMode: string = 'good';
    popupMode: string = 'click';
    popupType: string = 'default';
    popupSaveData: string = 'disabled';
    profileRedirectTo: string = '';
    customProfileRedirect: boolean = false;

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
        if (localStorage.getItem('imageQuality') == 'rick') {
            this.imageMode = 'rick';
        } else if (localStorage.getItem('imageQuality') == 'bad') {
            this.imageMode = 'bad';
        } else {
            localStorage.setItem('imageQuality', 'good');
            this.imageMode = 'good';
        }
        if (localStorage.getItem('popup-menu-mode') == 'click') {
            this.popupMode = 'click';
        } else if (localStorage.getItem('popup-menu-mode') == 'dblclick') {
            this.popupMode = 'dblclick';
        } else if (localStorage.getItem('popup-menu-mode') == 'contextmenu') {
            this.popupMode = 'contextmenu';
        } else {
            localStorage.setItem('popup-menu-mode', 'click');
            this.popupMode = 'click';
        }
        if (localStorage.getItem('popup-menu-type') == 'default') {
            this.popupType = 'default';
        } else if (localStorage.getItem('popup-menu-type') == 'defaultdev') {
            this.popupType = 'defaultdev';
        } else if (localStorage.getItem('popup-menu-type') == 'dev') {
            this.popupType = 'dev';
        } else {
            localStorage.setItem('popup-menu-type', 'default');
            this.popupType = 'default';
        }
        if (localStorage.getItem('popup-menu-save-data') == 'one') {
            this.popupSaveData = 'one';
        } else if (localStorage.getItem('popup-menu-save-data') == 'unlimited') {
            this.popupSaveData = 'unlimited';
        } else {
            localStorage.setItem('popup-menu-save-data', 'one');
            this.popupSaveData = 'one';
        }
        var account = localStorage.getItem('personalSpotifyAccount')
        if (account == null) {
            this.profileRedirectTo = '';
            localStorage.setItem('personalSpotifyAccount', '')
        } else {
            this.profileRedirectTo = account
        }
        if (localStorage.getItem('customPersonalSpotifyAccount') == null) {
            localStorage.setItem('customPersonalSpotifyAccount', 'false');
        } else {
            this.customProfileRedirect = localStorage.getItem('customPersonalSpotifyAccount') == 'true';
        }
        console.log(this.customProfileRedirect, localStorage.getItem('customPersonalSpotifyAccount'))
    }

    saveSettings() {
        // Code to save the settings goes here
        console.log('Settings saved');
        this.showToast('Settings saved!')
        // console.log(this.imageMode)
    }

    copyAcessKeyToClipboard() {
        localStorage.setItem('copyKeyToClipboard', 'true');
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        if (accessTokenURL != null) {
            this.retrieveToken(true)
        } else if (this.spotifyApiService.checkIfLoggedIn()) {
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

    imageModeChange() {
        localStorage.setItem('imageQuality', this.imageMode);
    }

    popupModeChange() {
        localStorage.setItem('popup-menu-mode', this.popupMode);
    }

    popupTypeChange() {
        localStorage.setItem('popup-menu-type', this.popupType);
    }

    popupSaveDataChange() {
        console.log(localStorage.getItem('popup-menu-save-data'))
        localStorage.setItem('popup-menu-save-data', this.popupSaveData);
        console.log(localStorage.getItem('popup-menu-save-data'))
    }

    profileRedirectChange() {
        localStorage.setItem('personalSpotifyAccount', this.profileRedirectTo);
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

    onSpotifyAccessTokenCheckboxChange(newValue: boolean) {
        this.spotifyAccessTokenStoring = newValue;
        localStorage.setItem('keepSpotifyAccessToken', this.spotifyAccessTokenStoring.toString());
        console.log(this.spotifyAccessTokenStoring);
    }

    onCustomProfileRedirectCheckboxChange(newValue: boolean) {
        this.customProfileRedirect = newValue;
        localStorage.setItem('customPersonalSpotifyAccount', this.customProfileRedirect.toString());
        console.log(this.customProfileRedirect);
        if (this.customProfileRedirect == false) {
            localStorage.setItem('personalSpotifyAccount', '');
            this.profileRedirectTo = '';
        }
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
