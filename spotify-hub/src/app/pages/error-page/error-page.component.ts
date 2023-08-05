import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {
    errorMessage: string = '';
    errorStatus: string = '';
    routeSub: Subscription | null = null;

    constructor(private route: ActivatedRoute) { }

    ngOnDestroy(): void {
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
    }

    ngOnInit() {
        localStorage.setItem('currentPage', 'playlist');
        this.routeSub = this.route.queryParams.subscribe(params => {
            this.errorMessage = params['message'];
            this.errorStatus = params['status'];
        });
    }
}
