import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastQueueService } from 'src/app/services/toast-queue.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { Router } from '@angular/router';
import { ClipboardItem } from '../../interfaces/clipboard-item.interface';
import { ClipboardServiceService } from 'src/app/services/clipboard-service.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'app-menu-popup',
    templateUrl: './menu-popup.component.html',
    styleUrls: ['./menu-popup.component.scss']
})
export class MenuPopupComponent implements OnInit {
    copiedResponse = "Copied data to our clipboard system!";
    unableToCopyResponse = 'Encountered error whilst trying to copy data to our clipboard system!';
    // @Input() typeOfMenu: string = '';
    showMenu: boolean = false;
    menuStyle: any = {};
    extraMenuStyle: any = {};
    dataValue: string | null = null;
    mode = 'Default';
    extraMenu = 0;
    myPlaylists: Array<any> = [];
    popupTypeDefault = true;
    popupTypeDev = true;

    constructor(private clipboard: Clipboard, private toastQueueService: ToastQueueService,
        private spotifyDataHandlerService: SpotifyDataHandlerService, private spotifyApiService: SpotifyApiService,
        private router: Router, private clipboardServiceService: ClipboardServiceService, private globalFunctionsService: GlobalFunctionsService) { }

    ngOnInit() {
        if (localStorage.getItem('popup-menu-mode') == null) {
            localStorage.setItem('popup-menu-mode', 'click');
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (localStorage.getItem('popup-menu-mode') == 'click') {
            this.checkForPopup(event);
        }
    }

    @HostListener('document:dblclick', ['$event'])
    onDocumentDblClick(event: MouseEvent) {
        if (localStorage.getItem('popup-menu-mode') == 'dblclick') {
            this.checkForPopup(event);
        }
    }

    @HostListener('document:contextmenu', ['$event'])
    onDocumentContextmenu(event: MouseEvent) {
        if (localStorage.getItem('popup-menu-mode') == 'contextmenu') {
            this.checkForPopup(event, 'contextmenu');
        }
    }

    checkCookies() {
        if (localStorage.getItem('popup-menu-type') == 'default') {
            this.popupTypeDev = false;
            this.popupTypeDefault = true;
        } else if (localStorage.getItem('popup-menu-type') == 'defaultdev') {
            this.popupTypeDev = true;
            this.popupTypeDefault = true;
        } else if (localStorage.getItem('popup-menu-type') == 'dev') {
            this.popupTypeDev = true;
            this.popupTypeDefault = false;
        } else {
            localStorage.setItem('popup-menu-type', 'default');
            this.popupTypeDev = false;
            this.popupTypeDefault = true;
        }
    }

    checkForPopup(event: MouseEvent, mode = '') {
        const clickedElement = event.target as HTMLElement;
        const menuItemElement = clickedElement.closest('.menu-item');
        if (menuItemElement && clickedElement.nodeName != "A") {
            this.checkCookies();
            // the above line is to disable the popup on hyperlinks
            if (mode == 'contextmenu') {
                event.preventDefault();
            }
            const dataValue = menuItemElement.getAttribute('data-value');
            if (menuItemElement.classList.contains('menu-type-song') || menuItemElement.classList.contains('menu-type-track')) {
                this.mode = 'TrackElement';
            } else if (menuItemElement.classList.contains('menu-type-artist')) {
                this.mode = 'ArtistElement';
            } else if (menuItemElement.classList.contains('menu-type-user')) {
                this.mode = 'UserElement';
            } else if (menuItemElement.classList.contains('menu-type-playlist')) {
                this.mode = 'PlaylistElement';
            } else if (menuItemElement.classList.contains('menu-type-album')) {
                this.mode = 'AlbumElement';
            } else if (menuItemElement.classList.contains('menu-type-genreName')) {
                this.mode = 'GenreNameElement';
            } else {
                this.mode = 'Default';
            }
            if (this.showMenu == false) {
                this.extraMenu = 0;
            }
            this.showMenu = true;
            this.calculateMenuPosition(event);
            if (dataValue) {
                this.dataValue = dataValue;
            } else {
                this.dataValue = null;
            }
        } else if (clickedElement.classList.contains('menu-popup-element') && clickedElement.nodeName != "A") {
            // this.showMenu = true;
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
            modifier = 1;
        }
        this.extraMenuStyle = {
            top: clickedButtonHeight + 'px',
            left: (mainMenuWidth * modifier) + 'px',
            width: menuWidth + 'px',
            // height: menuHeight + 'px'
        };
    }

    generateLink(id: string, type: string): string {
        return `https://open.spotify.com/${type}/${id}`;
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


    private showToast(toastMessage: string = 'Default Toast: "Hello World!"', type: string = 'info', timeModifier: number = 0) {
        this.toastQueueService.enqueueToast(toastMessage, type, timeModifier);
    }

    scanForBreak(article: any) {
        // Replace \n with <br> in the text
        article = article.replace(/\n/g, '<br>');

        return article;
    }

    addToPlaylistButton() {
        this.calculateExtraMenuPosition(90);
        this.extraMenu = 1;
        if (this.myPlaylists.length == 0) {
            this.spotifyDataHandlerService.getMyOwnPlaylists().subscribe(
                (response) => {
                    const playlists = response; // Assign the response directly
                    this.myPlaylists = playlists; // Assign to myPlaylists
                    this.spotifyDataHandlerService.ownPlaylists$.subscribe((newPlaylists) => {
                        this.myPlaylists = newPlaylists;
                    });
                },
                (error) => {
                    console.error('Error retrieving playlists:', error);
                    this.showToast(`Encountered Error whilst trying to retrieve playlists!\n${error.error.error.status} ${error.error.error.message}`, "error", 5);
                }
            );
        }
    }

    addTrackToPlaylist(id: string) {
        this.spotifyDataHandlerService.addSongToPlaylist(id, `spotify:track:${this.dataValue}`);
    }

    navigateToPlaylist() {
        if (this.dataValue != null) {
            this.showMenu = false;
            this.extraMenu = 0;
            this.router.navigate(['playlist'], { queryParams: { "playlistId": this.dataValue } });
        }
    }

    navigateToAlbum() {
        this.navigate('album')
    }

    navigateToUser() {
        this.navigate('user');
    }

    navigateToArtist() {
        this.navigate('artist');
    }

    navigateToTrack() {
        this.navigate('track');
    }

    navigate(type: string) {
        if (this.dataValue != null) {
            this.showMenu = false;
            this.extraMenu = 0;
            this.router.navigate([type, this.dataValue]);
        }
    }

    copyElement() {
        if (this.dataValue != null) {
            if (this.mode == 'PlaylistElement') {
                this.getPlaylistData(this.dataValue);
            } else if (this.mode == 'UserElement') {
                this.getUserData(this.dataValue)
            } else if (this.mode == 'TrackElement') {
                this.getTrackData(this.dataValue)
            } else if (this.mode == 'ArtistElement') {
                this.getArtistData(this.dataValue)
            } else if (this.mode == 'AlbumElement') {
                this.getAlbumData(this.dataValue)
            } else if (this.mode == 'GenreNameElement') {
                var item: ClipboardItem = {
                    "type": "GenreElement",
                    "id": this.clipboardServiceService.getClipboardId(),
                    "data": { "name": this.dataValue }
                };
                this.clipboardServiceService.addClipboardItem(item);
                this.showToast(this.copiedResponse);
            }
        }
    }


    getPlaylistData(playlistId: string, action: string = "copy") {
        const currentParams = playlistId;
        if (currentParams != undefined) {
            localStorage.setItem('playlistId', currentParams);
            this.spotifyDataHandlerService.getPlaylistData(currentParams).subscribe(
                (response) => {
                    var playlistData = response;
                    if (action == "copy") {
                        var item: ClipboardItem = {
                            "type": "PlaylistElement",
                            "id": this.clipboardServiceService.getClipboardId(),
                            "data": { ...playlistData }
                        };
                        this.clipboardServiceService.addClipboardItem(item);
                        this.showToast(this.copiedResponse);
                    } else if (action == "search") {
                        this.showMenu = false;
                        this.extraMenu = 0;
                        this.router.navigate(["search", playlistData["name"]]);
                    }
                },
                (error) => {
                    console.error('Error retrieving playlists:', error);
                    this.showToast(`${this.unableToCopyResponse}\n${error.error.error.status} ${error.error.error.message}`, "error", 5);
                }
            );
        }
    }

    getUserData(userId: string, action: string = "copy") {
        this.spotifyDataHandlerService.getUserProfile(userId).then((result) => {
            var user = result;
            if (action == "copy") {
                var item: ClipboardItem = {
                    "type": "UserElement",
                    "id": this.clipboardServiceService.getClipboardId(),
                    "data": { ...user }
                };
                this.clipboardServiceService.addClipboardItem(item);
                this.showToast(this.copiedResponse);
            } else if (action == "search") {
                this.showMenu = false;
                this.extraMenu = 0;
                this.router.navigate(["search", user["display_name"]]);
            }
        },
            (error) => {
                console.error('Error retrieving playlists:', error);
                this.showToast(`${this.unableToCopyResponse}\n${error.error.error.status} ${error.error.error.message}`, "error", 5);
            }
        );
    }

    getTrackData(trackId: string, action: string = "copy") {
        this.spotifyDataHandlerService.getSongData(trackId).then((result) => {
            var track = result;
            if (action == "copy") {
                var item: ClipboardItem = {
                    "type": "TrackElement",
                    "id": this.clipboardServiceService.getClipboardId(),
                    "data": { ...track }
                };
                this.clipboardServiceService.addClipboardItem(item);
                this.showToast(this.copiedResponse);
            } else if (action == "search") {
                this.showMenu = false;
                this.extraMenu = 0;
                this.router.navigate(["search", track["name"]]);
            }
        },
            (error) => {
                console.error('Error retrieving playlists:', error);
                this.showToast(`${this.unableToCopyResponse}\n${error.error.error.status} ${error.error.error.message}`, "error", 5);
            }
        );
    }

    getArtistData(artistId: string, action: string = "copy") {
        this.spotifyDataHandlerService.getArtistData(artistId).then((result) => {
            var artist = result;
            if (action == "copy") {
                var item: ClipboardItem = {
                    "type": "ArtistElement",
                    "id": this.clipboardServiceService.getClipboardId(),
                    "data": { ...artist }
                };
                this.clipboardServiceService.addClipboardItem(item);
                this.showToast(this.copiedResponse);
            } else if (action == "search") {
                this.showMenu = false;
                this.extraMenu = 0;
                this.router.navigate(["search", artist["name"]]);
            }

        },
            (error) => {
                console.error('Error retrieving playlists:', error);
                this.showToast(`${this.unableToCopyResponse}\n${error.error.error.status} ${error.error.error.message}`, "error", 5);
            }
        );
    }

    getAlbumData(albumId: string, action: string = "copy") {
        this.spotifyDataHandlerService.getAlbumData(albumId).then((result) => {
            var album = result;
            if (action == "copy") {
                var item: ClipboardItem = {
                    "type": "AlbumElement",
                    "id": this.clipboardServiceService.getClipboardId(),
                    "data": { ...album }
                };
                this.clipboardServiceService.addClipboardItem(item);
                this.showToast(this.copiedResponse);
            } else if (action == "search") {
                this.showMenu = false;
                this.extraMenu = 0;
                this.router.navigate(["search", album["name"]]);
            }

        },
            (error) => {
                console.error('Error retrieving playlists:', error);
                this.showToast(`${this.unableToCopyResponse}\n${error.error.error.status} ${error.error.error.message}`, "error", 5);
            }
        );
    }

    SearchElement() {
        if (this.dataValue != null) {
            if (this.mode == 'PlaylistElement') {
                this.getPlaylistData(this.dataValue, "search");
            } else if (this.mode == 'UserElement') {
                this.getUserData(this.dataValue, "search")
            } else if (this.mode == 'TrackElement') {
                this.getTrackData(this.dataValue, "search")
            } else if (this.mode == 'ArtistElement') {
                this.getArtistData(this.dataValue, "search")
            } else if (this.mode == 'AlbumElement') {
                this.getAlbumData(this.dataValue, "search")
            } else if (this.mode == 'GenreNameElement') {
                this.showMenu = false;
                this.extraMenu = 0;
                this.router.navigate(["search", this.dataValue]);
            }
        } else {
            this.showToast("Can't search things without ID", "error", 5);
        }
    }

    visitOnSpotify() {
        if (this.dataValue != null) {
            this.showMenu = false;
            this.extraMenu = 0;
            if (this.mode == 'PlaylistElement') {
                window.open(`https://open.spotify.com/playlist/${this.dataValue}`, '_blank');
            } else if (this.mode == 'UserElement') {
                window.open(`https://open.spotify.com/user/${this.dataValue}`, '_blank');
            } else if (this.mode == 'TrackElement') {
                window.open(`https://open.spotify.com/track/${this.dataValue}`, '_blank');
            } else if (this.mode == 'ArtistElement') {
                window.open(`https://open.spotify.com/artist/${this.dataValue}`, '_blank');
            } else if (this.mode == 'AlbumElement') {
                window.open(`https://open.spotify.com/album/${this.dataValue}`, '_blank');
            } else if (this.mode == 'GenreElement') {
                window.open(`https://open.spotify.com/genre/${this.dataValue}`, '_blank');
            }
        } else {
            this.showToast("Can't search things without ID", "error", 5);
        }
    }
}
