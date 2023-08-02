import { Injectable } from '@angular/core';
import { ClipboardItem } from '../interfaces/clipboard-item.interface';

@Injectable({
    providedIn: 'root'
})
export class ClipboardServiceService {

    constructor() { }

    // This is the array that will hold all of the clipboard items
    clipboardItems: Array<ClipboardItem> = [];

    // This function will add a new item to the clipboardItems array
    addClipboardItem(item: ClipboardItem) {
        this.clipboardItems.push(item);
        console.log(this.clipboardItems);
    }

    getClipboardId() {
        return this.clipboardItems.length;
    }

}
