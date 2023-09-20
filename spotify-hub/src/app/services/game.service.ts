import { Injectable } from '@angular/core';
import { Observable, Subject, first } from 'rxjs';
import { RandomNumberService } from './random-number.service';
import { ClipboardServiceService } from './clipboard-service.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    game: any = {};
    private gameStateSubject!: Subject<boolean>;
    gameState$!: Observable<boolean>;
    gameStateValue: boolean = false;

    constructor(private randomNumberService: RandomNumberService, private clipboardServiceService: ClipboardServiceService) {
        this.gameStateSubject = new Subject<boolean>();
        this.gameState$ = this.gameStateSubject.asObservable();
    }

    setGameState(state: boolean) {
        if (state != this.gameStateValue) {
            this.gameStateSubject.next(state);
            this.gameStateValue = state;
        }
    }

    startNewGame() {
        this.game = {};
        this.setGameState(true);
        console.log(this.randomNumberService.getRandomNumber(undefined, undefined, 1));
        console.log(this.randomNumberService.getRandomNumber());
        console.log(this.randomNumberService.getRandomNumber());
    }

    generateRoom() {

    }
}
