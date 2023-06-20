import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalFunctionsService {

    constructor() { }

    convertNumber(number: number): string {
        const suffixes = ['', 'K', 'M'];
        const suffixIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
        const scaledNumber = number / Math.pow(10, suffixIndex * 3);
        const roundedNumber = Math.round(scaledNumber * 10) / 10;

        return `${roundedNumber}${suffixes[suffixIndex]}`;
    }
}
