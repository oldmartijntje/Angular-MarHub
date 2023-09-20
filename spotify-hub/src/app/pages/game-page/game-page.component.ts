import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
    gameActive: boolean = false;
    gameStateSubscription: Subscription | null = null;

    constructor(private gameService: GameService) { }

    ngOnInit(): void {
        this.gameStateSubscription = this.gameService.gameState$.subscribe((state) => {
            if (state) {
                console.log("game started")
                this.gameActive = true;
            } else {
                console.log("game not started")
                this.gameActive = false;
            }
        });

    }

    ngOnDestroy(): void {
        if (this.gameStateSubscription != null) {
            this.gameStateSubscription.unsubscribe();
        }
    }

    startNewGame() {
        this.gameService.startNewGame()
    }

}
