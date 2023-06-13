import { Component } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    Articles = [
        { "title": "New feature!", "text": "You can now dye your hair purple.", "class": "highlight", "image": { "enabled": true, "path": "assets/icons/OceanLogo.png", "altText": "An image to show the feature.", "bottomText": "This is an example Image" } }
    ];
    length = 1;
    addArticle() {
        var title = "message number " + this.length;
        var tex = "meow " + this.length + " times for me please OwO";
        this.length++;
        if (this.length % 2 == 0) {
            var clas = "highlight";
        } else {
            var clas = "";
        }
        if (this.length % 3 == 0) {
            var img = true;
        } else {
            var img = false;
        }
        this.Articles.push({ "title": title, "text": tex, "class": clas, "image": { "enabled": img, "path": "assets/icons/OceanLogo.png", "altText": "An image to show the feature.", "bottomText": "This is an example Image" } });
    }
}
