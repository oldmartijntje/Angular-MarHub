import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Image } from '../../interfaces/image.interface';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
    routeSub: Subscription | null = null;
    albums: Record<string, any> = {};
    tracks: Record<string, any> = {};
    artists: Record<string, any> = {};
    playlists: Record<string, any> = {};
    albumPage = 0;
    trackPage = 0;
    artistPage = 0;
    playlistPage = 0;
    showAlbums: boolean = true;
    showPlaylists: boolean = true;
    showArtists: boolean = true;
    showTracks: boolean = true;
    showSpotifyResults: boolean = true;

    constructor(private spotifyDataHandlerService: SpotifyDataHandlerService, private ActivatedRoute: ActivatedRoute,
        public globalFunctionsService: GlobalFunctionsService) { }

    ngOnDestroy(): void {
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
    }

    flipState(which: string) {
        if (which == 'albums') {
            this.showAlbums = !this.showAlbums;
        } else if (which == 'playlists') {
            this.showPlaylists = !this.showPlaylists;
        } else if (which == 'tracks') {
            this.showTracks = !this.showTracks;
        } else if (which == 'artists') {
            this.showArtists = !this.showArtists;
        }
    }

    isEmpty(obj: Record<string, any>) {
        return Object.keys(obj).length === 0;
    }

    replaceCharecterString(input: string) {
        input = input.replace("&#x27;", "'");
        return input
    }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'search');
        this.routeSub = this.ActivatedRoute.params.subscribe((params: Params) => {
            if (params['query'] != undefined) {
                localStorage.setItem('pageVariation', params['query']);
                this.search(params['query'], 'track');
                this.search(params['query'], 'album');
                this.search(params['query'], 'artist');
                this.search(params['query'], 'playlist');
            }

        });
    }

    getRedirectPage() {
        var path = localStorage.getItem('currentPage');
        if (path == null) {
            return 'home';
        } else {
            return path;
        }
    }

    search(query: string, type: string) {
        this.spotifyDataHandlerService.search(query, type).then((result) => {
            console.log(result);
            if (type == 'track') {
                this.tracks = result;
            } else if (type == 'album') {
                this.albums = result;
            } else if (type == 'playlist') {
                this.playlists = result;
            } else if (type == 'artist') {
                this.artists = result;
            }

        });
    }

    getCorrectPicture(pictures: Array<Image>): string {
        if (localStorage.getItem('imageQuality') == 'bad') {
            var size = Infinity;
            var image = '';
            pictures.forEach((element: Image) => {
                if (element.height < size) {
                    size = element.height;
                    image = element.url;
                } else if (element.height == null && size == Infinity) {
                    image = element.url;
                }
            });
            return image;
        } else if (localStorage.getItem('imageQuality') == 'rick') {
            return '../../../assets/images/rick.gif';
        } else {
            var size = 0;
            var image = '';
            pictures.forEach((element: Image) => {
                if (element.height > size) {
                    size = element.height;
                    image = element.url;
                } else if (element.height == null && size == 0) {
                    image = element.url;
                }
            });
            return image;
        }
    }
}
