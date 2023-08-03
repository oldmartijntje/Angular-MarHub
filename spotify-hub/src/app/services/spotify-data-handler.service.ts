import { Injectable } from '@angular/core';
import { SpotifyApiService } from './spotify-service.service';
import { Router } from '@angular/router';
import { ToastQueueService } from './toast-queue.service';
import { Observable, Subject, catchError, map, mergeAll, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpotifyDataHandlerService {
    private ownUserProfile: Record<string, any> = {};
    private ownPlaylistsSubject!: Subject<any[]>;
    ownPlaylists$!: Observable<any[]>;
    private ownPlaylists: Array<any> = [];
    private ownTop25: Array<any> = [];
    private ownFollowingArtists: Array<any> = [];
    private loggedIn: boolean = false;

    extraData: Record<string, any> = {};

    constructor(private toastQueueService: ToastQueueService, private spotifyApiService: SpotifyApiService, private router: Router) {
        this.ownPlaylistsSubject = new Subject<any[]>();
        this.ownPlaylists$ = this.ownPlaylistsSubject.asObservable();
    }

    setOwnPlaylists(newPlaylists: any[]) {
        this.ownPlaylists = newPlaylists;
        this.ownPlaylistsSubject.next(newPlaylists);
    }

    forgetEverything() {
        this.ownUserProfile = {};
        this.setOwnPlaylists([]);
        this.ownTop25 = [];
        this.ownFollowingArtists = [];
        this.loggedIn = false;
        console.log("forgor")
    }

    private getPlaylists(index: number = 0): Observable<boolean> {
        const amount = 50;
        const maxNumber = 1000;
        return this.spotifyApiService.getMyPlaylists(amount, index * amount).pipe(
            switchMap((response) => {
                const playlists = response.items;
                this.setOwnPlaylists(this.addItemstoTargetList(this.ownPlaylists, playlists));
                if (playlists.length === amount) {
                    return this.getPlaylists(index + 1);
                } else {
                    // Process the followed artists list
                    console.log(this.ownPlaylists);
                    return of(true);
                }

            }),
            catchError((error) => {
                console.error('Error retrieving playlists:', error);
                return of(false);
            })
        );
    }

    private addItemstoTargetList(target: Array<any>, source: Array<any>) {
        source.forEach(item => {
            target.push(item);
        });
        return target
    }

    private getNewToken(path: string = 'home') {
        const urlParams = new URLSearchParams(window.location.search);
        var accessTokenURL = urlParams.get('access_token');
        if (accessTokenURL != null) {
            this.spotifyApiService.setAccessToken(accessTokenURL);
            this.spotifyApiService.getMe().then((result) => {
                this.ownUserProfile = result;
                console.log(this.ownUserProfile);
            }).catch((error) => {
                console.error(error);
                if (error.status == 403) {
                    console.error(error.error)
                    // User not registered in the Developer Dashboard
                } else if (error.status == 401) {
                    console.log(error.error.error.message)
                    this.router.navigate([path]);
                    // outdated token
                    // should also remove params before trying again
                }
            });
        } else if (this.spotifyApiService.checkIfLoggedIn(`/${path}`)) {
            console.log('piss');
            this.spotifyApiService.getMe().then((result) => {
                this.ownUserProfile = result;
                console.log(this.ownUserProfile);
            }).catch((error) => {
                console.error(error);
                if (error.status == 403) {
                    console.error(error.error)
                    // User not registered in the Developer Dashboard
                } else if (error.status == 401) {
                    localStorage.removeItem('spotifyAccessToken')
                    console.log(error.error.error.message)
                    // outdated token
                }
            });
        }
    }

    private getFollowing() {
        this.spotifyApiService.getFollowedArtists().subscribe(
            (response) => {
                const followedArtists = response.artists.items;
                console.log(followedArtists)
                // Process the followed artists list
                this.ownFollowingArtists = followedArtists;
            },
            (error) => {
                console.error('Error retrieving followed artists:', error);
            }
        );
        // this.getPlaylists()
    }

    private getTopTracks() {
        this.spotifyApiService.getTopTracks().subscribe(
            (response) => {
                const topTracks = response.items;
                this.ownTop25 = topTracks
                this.ownTop25.forEach(element => {
                    element['clicked'] = false;
                });
                console.log(this.ownTop25)
            },
            (error) => {
                console.error('Error retrieving followed artists:', error);
            }
        );
    }

    private showToast(toastMessage: string = 'Default Toast: "Hello World!"', type: string = 'info', timeModifier: number = 0) {
        this.toastQueueService.enqueueToast(toastMessage, type, timeModifier);
    }

    private loginIfNotAlready(path: string = 'home') {
        if (!this.loggedIn) {
            this.spotifyApiService.checkIfLoggedIn(path)
            this.loggedIn = true
        }
    }

    private returnedErrorHandler(path: string | null = 'home', error: any) {
        console.error(error);
        if (error.status == 403) {
            console.error(error.error)
            // User not registered in the Developer Dashboard
        } else if (error.status == 401) {
            this.loggedIn = false
            localStorage.removeItem('spotifyAccessToken')
            this.router.navigate([path]);
            console.log(error.error.error.message)
            alert('outdated')
            if (path == null) {
                this.spotifyApiService.authorize('home')
            } else {
                this.spotifyApiService.authorize(path)
            }

            // outdated token
        }
    }

    private checkIfExtraDataDictExists(dictName: string = 'something') {
        if (dictName in this.extraData) {
            return true
        } else {
            this.extraData[dictName] = {};
            return true
        }
    }

    getUserProfile(path: string = 'home', userId: string = ''): Promise<any> {
        this.loginIfNotAlready(path);
        if (userId != '') {
            this.checkIfExtraDataDictExists('user')
            if ((userId in this.extraData['user']) == false) {
                return this.spotifyApiService.getUser(userId).then((result) => {
                    this.addUserToData(result);
                    console.log(this.extraData['user'][userId]);
                    return this.extraData['user'][userId];
                }).catch((error) => {
                    this.returnedErrorHandler(path, error);
                    throw error; // Throw the error to propagate it in the promise chain
                });
            } else {
                return new Promise((resolve, reject) => {
                    if (this.extraData['user'][userId]) {
                        resolve(this.extraData['user'][userId]);
                    } else {
                        reject(new Error('Own user profile not available.'));
                    }
                });
            }
        } else {
            if (Object.keys(this.ownUserProfile).length === 0) {
                return this.spotifyApiService.getMe().then((result) => {
                    this.ownUserProfile = result;
                    this.addUserToData(result);
                    console.log(this.ownUserProfile);
                    return this.ownUserProfile;
                }).catch((error) => {
                    this.returnedErrorHandler(path, error);
                    throw error; // Throw the error to propagate it in the promise chain
                });
            } else {
                return new Promise((resolve, reject) => {
                    if (this.ownUserProfile) {
                        resolve(this.ownUserProfile);
                    } else {
                        reject(new Error('Own user profile not available.'));
                    }
                });
            }
        }

    }

    getArtistsYouFollow(path: string = 'home'): Observable<any> {
        this.loginIfNotAlready(path);
        if (Object.keys(this.ownFollowingArtists).length === 0) {
            return this.spotifyApiService.getFollowedArtists().pipe(
                tap((result) => {
                    this.ownFollowingArtists = result;
                    console.log(this.ownFollowingArtists);
                }),
                catchError((error) => {
                    this.returnedErrorHandler(path, error);
                    throw error; // Throw the error to propagate it in the observable chain
                })
            );
        } else {
            return of(this.ownFollowingArtists);
        }
    }

    getTop25SongsFromLast30Days(path: string = 'home'): Observable<any> {
        this.loginIfNotAlready(path);
        if (Object.keys(this.ownTop25).length === 0) {
            return this.spotifyApiService.getTopTracks().pipe(
                tap((result) => {
                    this.ownTop25 = result;
                    console.log(this.ownTop25);
                }),
                catchError((error) => {
                    this.returnedErrorHandler(path, error);
                    throw error; // Throw the error to propagate it in the observable chain
                })
            );
        } else {
            return of(this.ownTop25);
        }
    }

    getMyOwnPlaylists(path: string | null = 'home'): Observable<any> {
        if (path == null) {
            path = 'home';
        }
        this.loginIfNotAlready(path);
        if (Object.keys(this.ownPlaylists).length === 0) {
            return this.getPlaylists().pipe(
                map(() => this.ownPlaylists), // Map to return this.ownPlaylists
                catchError((error) => {
                    this.returnedErrorHandler(path, error);
                    throw error;
                })
            );
        } else {
            return of(this.ownPlaylists);
        }
    }

    addSongToPlaylist(path: string = 'home', playlistId: string, trackUri: string) {
        this.loginIfNotAlready(path);
        this.spotifyApiService.addTrackToPlaylist(playlistId, trackUri).subscribe(
            (result) => {
                console.log(result);
                this.spotifyApiService.getSinglePlaylist(playlistId).subscribe(
                    (result) => {
                        console.log(result);
                        this.addPlaylistToData(result);
                        this.replaceDataFromPlaylist(result)
                        this.showToast('Added song to playlist!')
                        // Handle the result here
                    },
                    (error) => {
                        console.log(error);
                        this.returnedErrorHandler(path, error);
                        // Handle the error here
                    }
                );
            },
            (error) => {
                console.log(error);
                // Handle the error here
            }
        );
    }

    private addPlaylistToData(playlist: Record<string, any>) {
        this.addSomethingToData(playlist, 'playlist')
    }

    private addUserToData(user: Record<string, any>) {
        this.addSomethingToData(user, 'user')
    }

    private addSongToData(song: Record<string, any>) {
        this.addSomethingToData(song, 'song')
    }

    private addArtistToData(artist: Record<string, any>) {
        this.addSomethingToData(artist, 'artist')
    }

    private addSomethingToData(item: Record<string, any>, dictName: string = '404') {
        if (this.extraData.hasOwnProperty(dictName)) {
            this.extraData[dictName][item['id']] = item;
        } else {
            this.extraData[dictName] = {};
            this.extraData[dictName][item['id']] = item;
        }
    }

    private replaceDataFromPlaylist(playlist: Record<string, any>) {
        var playlists = this.ownPlaylists;
        playlists.forEach(element => {
            if (element.id == playlist['id']) {
                console.log('aaaaa')
                for (const key in element) {
                    if (playlist.hasOwnProperty(key)) {
                        if (key == 'tracks') {
                            console.log(key)
                        }
                        element[key] = playlist[key];
                        //console.log({ ...element })
                    }
                }
            }
        });
        this.setOwnPlaylists(playlists);
    }

    getPlaylistData(path: string = 'home', playlistId: string): Observable<any> {
        this.loginIfNotAlready(path);
        console.log(1)
        if (this.extraData.hasOwnProperty('playlist')) {
            console.log(2)
            if (this.extraData['playlist'].hasOwnProperty(playlistId)) {
                console.log(3)
                return of(this.extraData['playlist'][playlistId]);
            } else {
                return this.spotifyApiService.getSinglePlaylist(playlistId).pipe(
                    tap((result) => {
                        console.log(result);
                        this.addPlaylistToData(result);
                    }),
                    map(() => this.extraData['playlist'][playlistId]),
                    catchError((error) => {
                        console.error(error);
                        this.returnedErrorHandler(path, error);
                        throw error;
                    })
                );
            }
        } else {
            this.extraData['playlist'] = {};
            return this.spotifyApiService.getSinglePlaylist(playlistId).pipe(
                tap((result) => {
                    console.log(result);
                    this.addPlaylistToData(result);
                }),
                map(() => this.extraData['playlist'][playlistId]),
                catchError((error) => {
                    console.error(error);
                    this.returnedErrorHandler(path, error);
                    throw error;
                })
            );
        }

    }

    getSongData(path: string = 'home', songId: string): Promise<any> {
        this.loginIfNotAlready(path);
        this.checkIfExtraDataDictExists('song');
        if ((songId in this.extraData['song']) == false) {
            return this.spotifyApiService.getSongById(songId).then((result) => {
                this.addSongToData(result);
                console.log(this.extraData['song'][songId]);
                return this.extraData['song'][songId];
            }).catch((error) => {
                this.returnedErrorHandler(path, error);
                throw error; // Throw the error to propagate it in the promise chain
            });
        } else {
            return new Promise((resolve, reject) => {
                if (this.extraData['song'][songId]) {
                    resolve(this.extraData['song'][songId]);
                } else {
                    reject(new Error('song not available.'));
                }
            });
        }
    }

    getArtistData(path: string = 'home', artistId: string): Promise<any> {
        this.loginIfNotAlready(path);
        this.checkIfExtraDataDictExists('artist');
        if ((artistId in this.extraData['artist']) == false) {
            return this.spotifyApiService.getArtistById(artistId).then((result) => {
                this.addArtistToData(result);
                console.log(this.extraData['artist'][artistId]);
                return this.extraData['artist'][artistId];
            }).catch((error) => {
                this.returnedErrorHandler(path, error);
                throw error; // Throw the error to propagate it in the promise chain
            });
        } else {
            return new Promise((resolve, reject) => {
                if (this.extraData['artist'][artistId]) {
                    resolve(this.extraData['artist'][artistId]);
                } else {
                    reject(new Error('artist not available.'));
                }
            });
        }
    }
}
