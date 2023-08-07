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

    log(variable: any, from: string = "Unsigned", type: string = 'log') {
        if (type == "log") {
            console.log(`from: ${from}:`, variable)
        } else if (type == "info") {
            console.info(`from: ${from}:`, variable)
        } else if (type == "error") {
            console.error(`from: ${from}:`, variable)
        } else if (type == "warning") {
            console.warn(`from: ${from}:`, variable)
        }
    }
}
