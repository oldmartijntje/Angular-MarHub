import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    Articles = [
        {
            "title": "Welcome to Spotihub!", "text": "Welcome,\nWe'd like to thank you for visiting this new website.",
            "class": "highlight", "image": {
                "enabled": false, "path": "", "altText": "",
                "bottomText": ""
            },
            "bottomText": { "enabled": true, "innerHTML": "To read the full info on this website, <a href='/docs'>Click here!</a>" }
        }
    ];
    length = 1;

    ngOnInit(): void {
        for (let i = 0; i < this.Articles.length; i++) {
            this.Articles[i] = this.scanForBreak(this.Articles[i]);
        }
    }

    scanForBreak(article: any) {
        // Replace \n with <br> in the title
        article.title = article.title.replace(/\n/g, '<br>');

        // Replace \n with <br> in the text
        article.text = article.text.replace(/\n/g, '<br>');

        // Replace \n with <br> in the bottomText.innerHTML
        article.bottomText.innerHTML = article.bottomText.innerHTML.replace(/\n/g, '<br>');
        return article;
    }
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
        if (this.length % 5 == 0) {
            var bottomText = true;
        } else {
            var bottomText = false;
        }
        var article = {
            "title": title, "text": tex, "class": clas, "image": {
                "enabled": img, "path": "assets/icons/OceanLogo.png", "altText": "An image to show the feature.",
                "bottomText": "This is an example Image"
            },
            "bottomText": { "enabled": bottomText, "innerHTML": "meow" }
        }
        article = this.scanForBreak(article);
        this.Articles.push(article);
    }


}
