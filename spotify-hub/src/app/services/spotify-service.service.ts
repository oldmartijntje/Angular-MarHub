import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';

@Injectable({
    providedIn: 'root'
})
export class SpotifyApiService {
    private spotifyApi: any;

    constructor() {
        this.spotifyApi = new SpotifyWebApi();
    }

    setAccessToken(token: string): void {
        this.spotifyApi.setAccessToken(token);
    }

    getMe(): Promise<any> {
        return this.spotifyApi.getMe();
    }

    // Other methods for interacting with the Spotify API
}
