import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify-service.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { ToastQueueService } from 'src/app/services/toast-queue.service';
import { SpotifyDataHandlerService } from 'src/app/services/spotify-data-handler.service';
import { Subscribable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Image } from '../../interfaces/image.interface';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})

export class UserPageComponent implements OnInit, OnDestroy {
    accessToken: string | null = null;
    user: any;
    followingArtists: Array<any> = [];
    createdPlaylists: Array<any> = [];
    top25Songs: Array<any> = [];
    toastMessage: string = '';
    myPlaylists: Array<any> = [];
    showImage = false;
    playlistsSubscription: Subscription | null = null;
    routeSub: Subscription | null = null;
    self = false;
    skin = '';
    profileImage = '';

    constructor(private router: Router, private spotifyDataHandlerService: SpotifyDataHandlerService,
        public globalFunctionsService: GlobalFunctionsService, private activatedRoute: ActivatedRoute) { }

    ngOnDestroy(): void {
        if (this.playlistsSubscription != null) {
            this.playlistsSubscription.unsubscribe();
        }
        if (this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
    }

    navigate(type: string, id: string) {
        if (type == 'playlist') {
            this.router.navigate([`/${type}`], { queryParams: { "playlistId": id } })
        } else {
            this.router.navigate([`/${type}/${id}`]);
        }
    }

    ngOnInit(): void {
        localStorage.setItem('currentPage', 'user');
        this.waitTimeForImage(10000)
        this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
            if (params['uid'] == undefined) {
                localStorage.setItem('pageVariation', '')
                this.self = true;
                this.spotifyDataHandlerService.getUserProfile().then((result) => {
                    this.globalFunctionsService.log(result)
                    this.user = result;
                    if ((localStorage.getItem('personalSpotifyAccount') == null || localStorage.getItem('personalSpotifyAccount') == '') && localStorage.getItem('customPersonalSpotifyAccount') == 'false') {
                        localStorage.setItem('personalSpotifyAccount', this.user.id)
                    }
                    this.giveCertainPeopleSkins();
                });
                this.spotifyDataHandlerService.getArtistsYouFollow().subscribe(
                    (response) => {
                        const followedArtists = response.artists.items;
                        this.globalFunctionsService.log(followedArtists);
                        // Process the followed artists list
                        this.followingArtists = followedArtists;
                    },
                    (error) => {
                        console.error('Error retrieving followed artists:', error);
                    }
                );
                this.spotifyDataHandlerService.getTop25SongsFromLast30Days().subscribe(
                    (response) => {
                        const topTracks = response.items;
                        this.top25Songs = topTracks
                        // this.top25Songs.forEach(element => {
                        //     element['clicked'] = false;
                        // });
                        this.globalFunctionsService.log(this.top25Songs)
                    },
                    (error) => {
                        console.error('Error retrieving followed artists:', error);
                    }
                );
                this.spotifyDataHandlerService.getMyOwnPlaylists().subscribe(
                    (response) => {
                        const playlists = response; // Assign the response directly
                        this.myPlaylists = playlists; // Assign to myPlaylists
                        this.globalFunctionsService.log(this.myPlaylists);
                        this.playlistsSubscription = this.spotifyDataHandlerService.ownPlaylists$.subscribe((newPlaylists) => {
                            this.myPlaylists = newPlaylists;
                            this.globalFunctionsService.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                        });
                    },
                    (error) => {
                        console.error('Error retrieving playlists:', error);
                    }
                );
            } else {
                localStorage.setItem('pageVariation', params['uid'])
                this.self = false;
                this.spotifyDataHandlerService.getUserProfile(params['uid']).then((result) => {
                    this.globalFunctionsService.log(result)
                    this.user = result;
                    if (localStorage.getItem('personalSpotifyAccount') == this.user.id) {
                        this.router.navigate(['user']);
                    }
                    this.giveCertainPeopleSkins();
                });
            }
        });

    }

    getCorrectPicture(pictures: Array<Image>): string {
        if (localStorage.getItem('imageQuality') == 'bad') {
            var size = Infinity;
            var image = '';
            pictures.forEach((element: Image) => {
                if (element.height < size) {
                    size = element.height;
                    image = element.url;
                } else if (element.height == null && size == Infinity) {
                    image = element.url;
                }
            });
            return image;
        } else if (localStorage.getItem('imageQuality') == 'rick') {
            return '../../../assets/images/rick.gif';
        } else {
            var size = 0;
            var image = '';
            pictures.forEach((element: Image) => {
                if (element.height > size) {
                    size = element.height;
                    image = element.url;
                } else if (element.height == null && size == 0) {
                    image = element.url;
                }
            });
            return image;
        }
    }

    isOwnUserProfileEmpty(): boolean {
        // return true
        return !this.user || Object.keys(this.user).length === 0;
    }

    waitTimeForImage(time: number = 1000) {
        setTimeout(() => {
            // Code to be executed after
            this.showImage = true
        }, time); // 1000 milliseconds = 1 second
    }

    // Call the function to wait for one second

    replaceCharecterString(input: string) {
        input = input.replace("&#x27;", "'");
        return input
    }

    giveCertainPeopleSkins() {
        if (this.user.id == '31pimce2yvnjy7676xhxtp7ouohu') {
            this.skin = 'heart';
        } else if (this.user.id == '7uatf47gcofdupwdxammpxliw') {
            this.skin = 'marvelSnap';
        } else if (this.user.id == 'xqbc7jduli6jzog1p7d590tg3' || this.user.id == 'tomsom9999') {
            this.skin = 'doctorStrange';
        } else if (this.user.id == '31um5yhss4zmmvxvkzxjhurkajiu') {
            this.skin = 'bobux';
        } else if (this.user.id == 'vjyh8y2mox894jysp0tnxbmus') {
            this.skin = 'cookieClicker';
        } else if (this.user.id == 'liannevanhouwelingen') {
            this.skin = 'poloroid';
        } else if (this.user.id == '90s922es1k37z7et7oamoktkj') {
            this.skin = 'openttd'
        }
    }




}
