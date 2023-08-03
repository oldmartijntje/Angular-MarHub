import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    constructor(private router: Router) { }

    onSearchClicked(searchTerm: string) {
        console.log('Search term:', searchTerm);
        // You can add your search functionality here
        this.router.navigate(['/search', searchTerm]);
    }
}
