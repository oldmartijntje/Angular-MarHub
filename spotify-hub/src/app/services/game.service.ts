import { Injectable } from '@angular/core';
import { Observable, Subject, first } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    game: any = {};
    private gameStateSubject!: Subject<boolean>;
    gameState$!: Observable<boolean>;
    gameStateValue: boolean = false;

    constructor() {
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
        this.setGameState(true)
    }
}
