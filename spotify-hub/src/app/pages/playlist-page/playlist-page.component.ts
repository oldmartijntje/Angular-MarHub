import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
    selector: 'app-playlist-page',
    templateUrl: './playlist-page.component.html',
    styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent {
    playlistId: string | undefined = undefined;
    playlistData: Record<string, any> = {};

    constructor(private route: ActivatedRoute, private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
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
                    // this.router.navigate(['playlist'], { queryParams: { "playlistId": response.id } });
                },
                (error) => {
                    console.error('Error retrieving playlists:', error);
                }
            );
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
