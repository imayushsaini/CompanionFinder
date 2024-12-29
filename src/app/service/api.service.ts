import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    readonly apiUrl: string =
        'https://companionfinder.ballistica.workers.dev/api';
    constructor(private http: HttpClient) {}

    getUserPosts(): Observable<any> {
        return this.http.get(this.apiUrl + '/trips');
    }
    fetchProfile() {
        return this.http.get(this.apiUrl + '/user');
    }
    updateProfile(about: string) {
        return this.http.post(this.apiUrl + '/user', { about: about });
    }
}
