import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../secrets/keys';

@Injectable({
    providedIn: 'root'
})
export class SpotifyApiService {
    private clientId = environment.spotify.clientId;
    private redirectUri = 'http://127.0.0.1:4200/callback';
    private tokenEndpoint = 'https://accounts.spotify.com/api/token';
    private accessToken: string | null = null;

    constructor(private http: HttpClient) { }

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    authorize(): void {
        const scopes = ['user-read-private'];
        const state = this.generateRandomString(16);
        const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}`;

        // Redirect the user to the authorizeUrl
        window.location.href = authorizeUrl;
    }

    exchangeAuthorizationCode(code: string, state: string): Observable<string> {
        const tokenEndpoint = 'https://accounts.spotify.com/api/token';
        const clientId = environment.spotify.clientId;
        const clientSecret = environment.spotify.clientSecret;
        const redirectUri = 'http://127.0.0.1:4200/callback';

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('code', code)
            .set('redirect_uri', redirectUri)
            .set('client_id', clientId)
            .set('client_secret', clientSecret);

        return this.http.post<any>(tokenEndpoint, body, { headers });
    }

    private generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    }

    getMe(): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
        return this.http.get<any>('https://api.spotify.com/v1/me', { headers }).toPromise();
    }

    // Other methods for interacting with the Spotify API
}