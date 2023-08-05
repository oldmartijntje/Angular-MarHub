import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { Image } from '../../interfaces/image.interface';

@Component({
    selector: 'app-song-page',
    templateUrl: './song-page.component.html',
    styleUrls: ['./song-page.component.scss']
})
export class SongPageComponent implements OnInit, OnDestroy {
    routeSub: Subscription | null = null;
    mode: string = "waiting";
    data: Record<string, any> = {};
    errorMessage: string = '';
    errorType: string = '';

    constructor(private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService,
        public globalFunctionsService: GlobalFunctionsService, private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'song');
        this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
            if (params['id'] == undefined) {
                localStorage.setItem('pageVariation', '');
                this.mode = "error";
                this.errorMessage = 'Empty URL';
                this.errorType = '404';
            } else {
                localStorage.setItem('pageVariation', params['id']);
                this.spotifyDataHandlerService.getSongData(params['id']).then((result) => {
                    this.globalFunctionsService.log(result)
                    this.mode = "OK";
                    this.data = result;
                }).catch((error) => {
                    this.globalFunctionsService.log(error);
                    this.errorType = error.error.error.status;
                    this.errorMessage = error.error.error.message;
                    this.mode = "error";
                    this.globalFunctionsService.log(this.mode);
                });
            }
        });

    }

    navigate(type: string, id: string) {
        this.router.navigate([`/${type}/${id}`]);
    }

    msToHMS(milliseconds: number): string {
        const seconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const hms = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        return hms;
    }

    ngOnDestroy(): void {
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
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
