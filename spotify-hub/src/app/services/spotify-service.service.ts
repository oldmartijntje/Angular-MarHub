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
    private redirectUri = environment.spotify.redirectUri;
    private tokenEndpoint = 'https://accounts.spotify.com/api/token';
    private accessToken: string | null = null;
    private apiUrl = 'https://api.spotify.com/v1'

    constructor(private http: HttpClient) { }

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    authorize(): void {
        const scopes = ['user-read-private', 'user-follow-read', 'user-library-read', 'user-top-read', 'playlist-modify-public', 'playlist-modify-private'];
        const state = this.generateRandomString(16);
        const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}`;

        // Redirect the user to the authorizeUrl
        window.location.href = authorizeUrl;
    }

    checkIfLoggedIn(autoLogin: boolean = true): boolean {
        this.accessToken = localStorage.getItem('spotifyAccessToken');
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        if (this.accessToken != null) {
            this.setAccessToken(this.accessToken)
            return true
        } else if (accessTokenURL != null) {
            this.setAccessToken(accessTokenURL)
            return true
        }
        else {
            if (autoLogin) {
                this.authorize()
            }
            return false
        }
    }

    exchangeAuthorizationCode(code: string, state: string): Observable<string> {
        const tokenEndpoint = 'https://accounts.spotify.com/api/token';
        const clientId = environment.spotify.clientId;
        const clientSecret = environment.spotify.clientSecret;
        const redirectUri = environment.spotify.redirectUri;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('code', code)
            .set('redirect_uri', redirectUri)
            .set('client_id', clientId)
            .set('client_secret', clientSecret);

        return this.http.post<any>(tokenEndpoint, body, { headers });
    }

    refreshToken(refreshToken: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.clientId + ':' + environment.spotify.clientSecret));
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken);

        return this.http.post<any>(this.apiUrl, body.toString(), { headers }).toPromise();
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
        return this.http.get<any>(`${this.apiUrl}/me`, { headers }).toPromise();
    }

    getUser(userId: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/users/${userId}`, { headers }).toPromise();
    }

    getFollowedArtists(): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/me/following?type=artist`, { headers });
    }

    getMyPlaylists(limit: number, offset: number): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/me/playlists?limit=${String(limit)}&offset=${String(offset)}`, { headers });
    }

    getAvailableGenres(): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/recommendations/available-genre-seeds`, { headers });
    }

    getTopTracks(): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        const queryParams = {
            time_range: 'short_term',
            limit: '25'
        };

        return this.http.get<any>(`${this.apiUrl}/me/top/tracks`, { headers, params: queryParams });
    }

    addTrackToPlaylist(playlistId: string, trackUri: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);
        const body = {
            uris: [trackUri]
        };

        return this.http.post<any>(`${this.apiUrl}/playlists/${playlistId}/tracks`, body, { headers });
    }

    getSinglePlaylist(playlistId: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/playlists/${playlistId}`, { headers });
    }

    getSongById(songId: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/tracks/${songId}`, { headers }).toPromise();
    }

    getArtistById(artistId: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/artists/${artistId}`, { headers }).toPromise();
    }

    search(query: string, type: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        const params = new HttpParams()
            .set('q', query)
            .set('type', type);

        return this.http.get<any>(`${this.apiUrl}/search`, { headers, params }).toPromise();
    }

    getAlbumById(albumId: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/albums/${albumId}`, { headers }).toPromise();
    }

    getAlbumsByArtistId(artistId: string): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        const params = new HttpParams()
            .set('include_groups', 'album')
            .set('market', 'US'); // Replace with the desired market code

        return this.http.get<any>(`${this.apiUrl}/artists/${artistId}/albums`, { headers, params }).toPromise();
    }

}
