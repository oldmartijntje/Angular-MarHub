import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RandomNumberService {

    constructor() { }

    private hashStringToNumber(input: string): number {
        // Simple string to number hashing function
        let hash = 0;
        if (input.length === 0) return hash;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        return Math.abs(hash);
    }

    private stringifySeed(providedSeed: string | number = ''): string {
        return `${providedSeed}`;
    }

    getRandomNumber(min: number = 0, max: number = 10, providedSeed: string | number = ''): number {
        // Calculate a seed based on the provided string
        const seed = this.hashStringToNumber(this.stringifySeed(providedSeed));

        // Custom pseudo-random number generator using the seed
        const x = Math.sin(seed) * 10000;

        // Map the random number to the specified range [min, max]
        const randomNumber = Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;

        return randomNumber;
    }
}
