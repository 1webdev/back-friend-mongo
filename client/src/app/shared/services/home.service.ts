import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from "rxjs/Subject";

import { ApiService } from './api.service';

@Injectable()
export class HomeService {
    constructor(
        private apiService: ApiService
    ) { }


    getPlayers(): Observable<[string]> {
        return this.apiService.get('api/players').map(data => data);
    }
    
    playerBallance(ID: string): Observable<[string]> {
        return this.apiService.get('api/playerBallance/' + ID).map(data => data);
    }
    
    getTournaments(): Observable<[string]> {
        return this.apiService.get('api/tournaments').map(data => data);
    }
    
    resultTournament(ID: string): Observable<[string]> {
        return this.apiService.post('api/resultTournament/' + ID).map(data => data);
    }
    
    insertPlayer(data): Observable<[string]> {
        return this.apiService.post('api/player', data).map(data => data);
    }

    announcementTournament(data): Observable<[string]> {
        return this.apiService.post('api/tournament', data).map(data => data);
    }
    
    addCoinsPlayer(ID: string, data) {
        return this.apiService.put('api/player/' + ID, data).map(data => data);
    }
    
    joinTournament(ID: string, data) {
        return this.apiService.put('api/tournament/' + ID, data).map(data => data);
    }
    
    resetData(): Observable<[string]> {
        return this.apiService.get('api/reset').map(data => data);
    }

}
