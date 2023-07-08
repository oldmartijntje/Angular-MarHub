import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { Subscription } from 'rxjs';
import { Image } from '../../interfaces/image.interface'

@Component({
    selector: 'app-playlist-page',
    templateUrl: './playlist-page.component.html',
    styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnDestroy {
    playlistId: string | undefined = undefined;
    playlistData: Record<string, any> = {};
    playlistsSubscription: Subscription | null = null;
    routeSub: Subscription | null = null;

    constructor(private route: ActivatedRoute, private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService) { }

    ngOnDestroy(): void {
        if (this.playlistsSubscription != null) {
            this.playlistsSubscription.unsubscribe();
        }
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
    }

    ngOnInit() {
        this.routeSub = this.route.queryParams.subscribe(params => {
            this.playlistId = params['playlistId'];

            if (!this.playlistId) {
                const currentParams = this.route.snapshot.queryParams;
                const urlWithParams = `/playlist/404nf?${this.serializeParams(currentParams)}`;
                this.router.navigateByUrl(urlWithParams);
            } else {
                // Proceed with your logic if the playlistId exists
                this.getPlaylistData()
            }
        });
    }

    getPlaylistData() {
        const currentParams = this.playlistId;
        if (currentParams != undefined) {
            localStorage.setItem('playlistId', currentParams)
            this.spotifyDataHandlerService.getPlaylistData('playlist', currentParams).subscribe(
                (response) => {
                    console.log(response);
                    this.playlistData = response;
                    this.playlistsSubscription = this.spotifyDataHandlerService.ownPlaylists$.subscribe((newPlaylists) => {
                        newPlaylists.forEach(element => {
                            if (element.id == currentParams) {
                                this.playlistData = element;
                            }
                        });
                    });
                    // this.router.navigate(['playlist'], { queryParams: { "playlistId": response.id } });
                },
                (error) => {
                    console.error('Error retrieving playlists:', error);
                }
            );
        }
    }

    getCorrectPicture(pictures: Array<Image>): string {
        if (localStorage.getItem('imageQuality') == 'crack') {
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
        } else if (localStorage.getItem('imageQuality') == 'none') {
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

    private serializeParams(params: any): string {
        const encodedParams = Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');
        return encodedParams;
    }

    isPlaylistDataEmpty(): boolean {
        // return true
        return !this.playlistData || Object.keys(this.playlistData).length === 0;
    }
}
