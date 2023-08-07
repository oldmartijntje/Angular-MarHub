import { Component, OnDestroy, OnInit } from '@angular/core';
import { Image } from '../../interfaces/image.interface';
import { Subscription } from 'rxjs';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'app-artist-page',
    templateUrl: './artist-page.component.html',
    styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit, OnDestroy {
    artistId: string | undefined = undefined;
    artistData: Record<string, any> = {};
    routeSub: Subscription | null = null;

    constructor(private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService,
        public globalFunctionsService: GlobalFunctionsService, private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'artist');
        this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
            if (params['id'] == undefined) {
                localStorage.setItem('pageVariation', '');
            } else {
                localStorage.setItem('pageVariation', params['id']);
                this.spotifyDataHandlerService.getArtistData(params['id']).then((result) => {
                    this.artistData = result;

                }).catch((error) => {

                });
            }
        });

    }

    ngOnDestroy(): void {
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
    }

    navigate(type: string, id: string) {
        this.router.navigate([`/${type}/${id}`]);
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

    isPlaylistDataEmpty(): boolean {
        // return true
        return !this.artistData || Object.keys(this.artistData).length === 0;
    }
}
