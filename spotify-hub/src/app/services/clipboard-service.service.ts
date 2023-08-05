import { Injectable } from '@angular/core';
import { ClipboardItem } from '../interfaces/clipboard-item.interface';
import { GlobalFunctionsService } from './global-functions.service';

@Injectable({
    providedIn: 'root'
})
export class ClipboardServiceService {

    constructor(private globalFunctionsService: GlobalFunctionsService) { }

    // This is the array that will hold all of the clipboard items
    clipboardItems: Array<ClipboardItem> = [];
    nextId: number = 0;

    // This function will add a new item to the clipboardItems array
    addClipboardItem(item: ClipboardItem) {
        if (localStorage.getItem('popup-menu-save-data') == 'one' || localStorage.getItem('popup-menu-save-data') == null) {
            this.clipboardItems.length = 0;
        }
        this.globalFunctionsService.log(localStorage.getItem('popup-menu-save-data'))
        this.clipboardItems.push(item);
        this.globalFunctionsService.log(this.clipboardItems);
    }

    getClipboardId() {
        this.nextId = this.nextId + 1;
        return this.nextId - 1;
    }

}
