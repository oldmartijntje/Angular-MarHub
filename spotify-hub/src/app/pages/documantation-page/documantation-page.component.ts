import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-documantation-page',
    templateUrl: './documantation-page.component.html',
    styleUrls: ['./documantation-page.component.scss']
})
export class DocumantationPageComponent implements OnInit {
    ngOnInit(): void {
        localStorage.setItem('currentPage', 'docs');
    }

}
