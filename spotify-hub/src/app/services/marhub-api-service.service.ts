import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { environment } from '../secrets/keys';

@Injectable({
    providedIn: 'root'
})
export class MarhubApiServiceService {

    constructor(private http: HttpClient) { }

    getAllNotes(): Promise<any> {
        return this.http.get(`${environment.marhub.apiUrl}/Note`).toPromise();
    }

    addNote(note: Note): Promise<any> {
        return this.http.post(`${environment.marhub.apiUrl}/Note`, note).toPromise();
    }

    updateNote(note: Note): Promise<any> {
        return this.http.put(`${environment.marhub.apiUrl}/Note`, note).toPromise();
    }

    deleteNote(noteId: Number): Promise<any> {
        return this.http.delete(`${environment.marhub.apiUrl}/Note/${noteId}`).toPromise();
    }
}
