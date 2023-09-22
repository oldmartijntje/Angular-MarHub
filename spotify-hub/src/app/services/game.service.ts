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
        this.game = { "rooms": [], "player": { "inventory": [], "roomId": 0 } };
        this.setGameState(true);
        this.generateRoom(69)
    }

    generateRoom(seed: number | string) {
        var room: any = { "walls": [], "floor": [], "triggers": [] }
    }
}
