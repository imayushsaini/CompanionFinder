import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    readonly backendURL: string = 'https://google.com/q?=ayush';
    constructor(private http: HttpClient) {}

    getUserPosts(): Observable<any> {
        return this.http.get(this.backendURL);
    }
}
