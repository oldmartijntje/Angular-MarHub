import { Component, HostListener, Input } from '@angular/core';

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

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const menuItemElement = clickedElement.closest('.menu-item');
        if (menuItemElement && clickedElement.nodeName != "A") {
            const dataValue = menuItemElement.getAttribute('data-value');
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

        const menuX = event.clientX + window.scrollX;
        const menuY = event.clientY + window.scrollY;

        this.menuStyle = {
            top: menuY + 'px',
            left: menuX + 'px',
            width: menuWidth + 'px',
            height: menuHeight + 'px'
        };
    }



    handleButtonClick(buttonLabel: string) {
        console.log('Button clicked:', buttonLabel);
        // Add your button click logic here
    }
}
