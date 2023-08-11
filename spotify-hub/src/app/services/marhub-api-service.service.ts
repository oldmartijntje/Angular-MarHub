import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MarhubApiServiceService {


    constructor(private http: HttpClient) { }

    getAllNotes(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/Note`).toPromise();
    }
}
