import { Injectable } from '@angular/core';
import { ClipboardItem } from '../interfaces/clipboard-item.interface';

@Injectable({
    providedIn: 'root'
})
export class ClipboardServiceService {

    constructor() { }

    // This is the array that will hold all of the clipboard items
    clipboardItems: Array<ClipboardItem> = [];
    nextId: number = 0;

    // This function will add a new item to the clipboardItems array
    addClipboardItem(item: ClipboardItem) {
        if (localStorage.getItem('popup-menu-save-data') == 'one' || localStorage.getItem('popup-menu-save-data') == null) {
            this.clipboardItems.length = 0;
        }
        console.log(localStorage.getItem('popup-menu-save-data'))
        this.clipboardItems.push(item);
        console.log(this.clipboardItems);
    }

    getClipboardId() {
        this.nextId = this.nextId + 1;
        return this.nextId - 1;
    }

}
