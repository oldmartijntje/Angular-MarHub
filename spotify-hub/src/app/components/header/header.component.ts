import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    constructor(private router: Router, private globalFunctionsService: GlobalFunctionsService) { }

    onSearchClicked(searchTerm: string) {
        this.globalFunctionsService.log('Search term:', searchTerm);
        // You can add your search functionality here
        this.router.navigate(['/search', searchTerm]);
    }
}
