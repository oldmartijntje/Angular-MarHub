import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';

@Component({
    selector: 'app-song-page',
    templateUrl: './song-page.component.html',
    styleUrls: ['./song-page.component.scss']
})
export class SongPageComponent implements OnInit, OnDestroy {
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
