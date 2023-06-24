import { Component, HostListener, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastQueueService } from 'src/app/services/toast-queue.service';

@Component({
    selector: 'app-menu-popup',
    templateUrl: './menu-popup.component.html',
    styleUrls: ['./menu-popup.component.scss']
})
export class MenuPopupComponent {
    // @Input() typeOfMenu: string = '';
    showMenu: boolean = false;
    menuStyle: any = {};
    dataValue: string | null = null;
    mode = 'Default'

    constructor(private clipboard: Clipboard, private toastQueueService: ToastQueueService) { }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const menuItemElement = clickedElement.closest('.menu-item');
        if (menuItemElement && clickedElement.nodeName != "A") {
            const dataValue = menuItemElement.getAttribute('data-value');
            if (menuItemElement.classList.contains('menu-type-song')) {
                this.mode = 'SongElement'
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

    generateLink(id: string, type: string): string {
        return `https://open.spotify.com/${type}/${id}`
    }

    copyLink(id: string, type: string): void {
        this.clipboard.copy(this.generateLink(id, type));
        this.showToast("Copied Link to clipboard!");
    }

    generateEmbed(id: string, type: string): string {
        return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator" width="69%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    }

    copyEmbed(id: string, type: string): void {
        this.clipboard.copy(this.generateEmbed(id, type));
        this.showToast("Copied Embed to clipboard!");
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
}
