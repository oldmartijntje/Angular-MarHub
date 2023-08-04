import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';

@Component({
    selector: 'app-album-page',
    templateUrl: './album-page.component.html',
    styleUrls: ['./album-page.component.scss']
})
export class AlbumPageComponent {
    routeSub: Subscription | null = null;

    constructor(private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService,
        public globalFunctionsService: GlobalFunctionsService, private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'user');
        this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
            if (params['id'] == undefined) {

            } else {

            }
        });

    }

    ngOnDestroy(): void {
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
    }
}
