import { Component, HostListener, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastQueueService } from 'src/app/services/toast-queue.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';

@Component({
    selector: 'app-menu-popup',
    templateUrl: './menu-popup.component.html',
    styleUrls: ['./menu-popup.component.scss']
})
export class MenuPopupComponent {
    // @Input() typeOfMenu: string = '';
    showMenu: boolean = false;
    menuStyle: any = {};
    extraMenuStyle: any = {};
    dataValue: string | null = null;
    mode = 'Default';
    extraMenu = 0;
    myPlaylists: Array<any> = [];

    constructor(private clipboard: Clipboard, private toastQueueService: ToastQueueService, private spotifyDataHandlerService: SpotifyDataHandlerService, private spotifyApiService: SpotifyApiService) { }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const menuItemElement = clickedElement.closest('.menu-item');
        if (menuItemElement && clickedElement.nodeName != "A") {
            const dataValue = menuItemElement.getAttribute('data-value');
            if (menuItemElement.classList.contains('menu-type-song')) {
                this.mode = 'SongElement'
            } else if (menuItemElement.classList.contains('menu-type-artist')) {
                this.mode = 'ArtistElement'
            } else if (menuItemElement.classList.contains('menu-type-playlist')) {
                this.mode = 'PlaylistElement'
            } else {
                this.mode = 'Default'
            }
            this.showMenu = true;
            this.calculateMenuPosition(event);
            if (dataValue) {
                this.dataValue = dataValue;
            } else {
                this.dataValue = null;
            }
        } else if (clickedElement.classList.contains('menu-popup-element') && clickedElement.nodeName != "A") {
            this.showMenu = true;
        } else {
            this.showMenu = false;
            this.extraMenu = 0;
        }
    }

    calculateMenuPosition(event: MouseEvent) {
        const menuWidth = 200; // Adjust as per your menu width
        const menuHeight = 150; // Adjust as per your menu height
        const scrollbarWidth = 35;

        const menuX = event.clientX + window.scrollX;
        const menuY = event.clientY + window.scrollY;

        const windowWidth = window.innerWidth;
        var modifierX = 0;

        if (menuWidth + menuX > windowWidth) {
            modifierX = (menuWidth + menuX - windowWidth) * -1
            modifierX -= scrollbarWidth
        }

        this.menuStyle = {
            top: menuY + 'px',
            left: menuX + modifierX + 'px',
            width: menuWidth + 'px',
            // height: menuHeight + 'px'
        };
    }

    calculateExtraMenuPosition(clickedButtonHeight: number = 0) {
        const menuWidth = 200; // Adjust as per your menu width
        const mainMenuWidth = 200; // Adjust as per your menu width
        const menuHeight = 150; // Adjust as per your menu height
        const scrollbarWidth = 35;

        var modifier = -1;

        if (parseFloat(this.menuStyle.left) < menuWidth) {
            modifier = 1
        }
        this.extraMenuStyle = {
            top: clickedButtonHeight + 'px',
            left: (mainMenuWidth * modifier) + 'px',
            width: menuWidth + 'px',
            // height: menuHeight + 'px'
        };
    }

    generateLink(id: string, type: string): string {
        return `https://open.spotify.com/${type}/${id}`
    }

    copyLink(id: string, type: string): void {
        this.clipboard.copy(this.generateLink(id, type));
        this.showToast("Copied Link to clipboard!");
        this.extraMenu = 0;
    }

    generateEmbed(id: string, type: string): string {
        return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator" width="69%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    }

    copyEmbed(id: string, type: string): void {
        this.clipboard.copy(this.generateEmbed(id, type));
        this.showToast("Copied Embed to clipboard!");
        this.extraMenu = 0;
    }


    handleButtonClick(buttonLabel: string) {
        console.log('Button clicked:', buttonLabel);
        // Add your button click logic here
    }

    private showToast(toastMessage: string = 'Default Toast: "Hello World!"', type: string = 'info', timeModifier: number = 0) {
        this.toastQueueService.enqueueToast(toastMessage, type, timeModifier);
    }

    scanForBreak(article: any) {
        // Replace \n with <br> in the text
        article = article.replace(/\n/g, '<br>');

        return article;
    }

    addToPlaylistButton() {
        this.calculateExtraMenuPosition(90)
        this.extraMenu = 1;
        if (this.myPlaylists.length == 0) {
            this.spotifyDataHandlerService.getMyOwnPlaylists('user').subscribe(
                (response) => {
                    const playlists = response; // Assign the response directly
                    this.myPlaylists = playlists; // Assign to myPlaylists
                    console.log(this.myPlaylists);
                    this.spotifyDataHandlerService.ownPlaylists$.subscribe((newPlaylists) => {
                        this.myPlaylists = newPlaylists;
                    });
                },
                (error) => {
                    console.error('Error retrieving playlists:', error);
                }
            );
        }
    }

    addSongToPlaylist(id: string) {
        this.spotifyDataHandlerService.addSongToPlaylist(this.getPage(), id, `spotify:track:${this.dataValue}`);
    }

    getPlaylistData() {
        if (this.dataValue != null) {
            this.spotifyDataHandlerService.getPlaylistData(this.getPage(), this.dataValue).subscribe(
                (response) => {
                    console.log(response);
                },
                (error) => {
                    console.error('Error retrieving playlists:', error);
                }
            );
        }
    }

    getPage() {
        var page = 'home';
        const currentPage = localStorage.getItem('currentPage');
        if (currentPage != null) {
            page = currentPage;
        }
        return page
    }
}
