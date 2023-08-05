import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { Image } from '../../interfaces/image.interface';

@Component({
    selector: 'app-album-page',
    templateUrl: './album-page.component.html',
    styleUrls: ['./album-page.component.scss']
})
export class AlbumPageComponent implements OnInit, OnDestroy {
    albumId: string | undefined = undefined;
    albumData: Record<string, any> = {};
    routeSub: Subscription | null = null;

    constructor(private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService,
        public globalFunctionsService: GlobalFunctionsService, private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'album');
        this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
            if (params['id'] == undefined) {
                localStorage.setItem('pageVariation', '');
            } else {
                localStorage.setItem('pageVariation', params['id']);
                this.spotifyDataHandlerService.getAlbumData(params['id']).then((result) => {
                    this.globalFunctionsService.log(result)
                    this.albumData = result;

                }).catch((error) => {
                    this.globalFunctionsService.log(error);

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
        return !this.albumData || Object.keys(this.albumData).length === 0;
    }
}
