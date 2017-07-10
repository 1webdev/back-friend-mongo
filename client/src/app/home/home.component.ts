import { Component, EventEmitter, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HomeService } from '../shared/services/home.service';
import { Player } from '../model/player';
import { Tournament } from '../model/tournament';


@Component({
    selector: 'home-page', templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    players: Array<Player> = [];
    playersData: any = {};
    tournaments: Array<Tournament> = [];
    amount: number = 0;
    tournamentsBakers: any = {};
    ballance: number = -1;

    constructor(private homeService: HomeService) {

    }

    ngOnInit() {
        this._getPlayers();
        this._getTournaments();
    }

    createPlayer() {
        this.players.push(new Player());
    }

    savePlayer(position: any) {
        if (this.players && this.players[position]) {
            var newPlayer = this.players[position];
            if (!newPlayer._id) {
                var data = { name: newPlayer.name, ballance: 0 };
                this._savePlayer(data, position);
            }
        }
    }

    addCoinsPlayer(position: any, action:string = '') {
        if (this.players && this.players[position] && this.players[position]._id) {
            var playerId = this.players[position]._id;
            var amount = this.players[position].fund;
                        
            this.homeService.addCoinsPlayer(playerId, {amount: amount, action: action}).subscribe((result: any) => {
                if (result.status == 'success') {
                    this.players[position] = new Player(result.player);
                }
            });
        }
    }

    resultTournament(tournamentID: string) {
        this.homeService.resultTournament(tournamentID).subscribe((result: any) => {
            if (result.status == 'success') {
                this.ngOnInit();
            }
        });
    }

    joinTournament(tournamentId: string, player: Player) {
        this.homeService.joinTournament(tournamentId, player).subscribe((result: any) => {
            if (result.status == 'success') {
                this.ngOnInit();
            }
        });
    }

    announcement() {
        if(!this.amount) {
            return false;
        }
        
        this.homeService.announcementTournament({amount: this.amount}).subscribe((result: any) => {
            if (result.status == 'success') {
                this.amount = 0;
                this._getTournaments();
            }
        });
    }

    resetData() {
        this.homeService.resetData().subscribe((result: any) => {
            if (result.status == 'success') {
                this.ngOnInit();
            }
        });
    }

    getBalance(player: any) {
        this.ballance = -1;
        if(!player || player == '0') {
            return false;
        }
        
        this.homeService.playerBallance(player).subscribe((result: any) => {
            if (result.status == 'success') {
                this.ballance = result.player.ballance;
            }
        });
    }

    createdPlayers() {
        if (!this.players.length) {
            return [];
        }
        
        var existed = [];
        this.players.forEach((player) => {
            if(player._id) {
                existed.push(player);
            }
        });
        
        return existed;
    }

    _keyPressInt(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.charCode) {
            event.preventDefault();
        }
    }
    
    _checkJoin(tournament: any, playerId: string, ballance: number) {
        
        if(ballance <= 0) {
            return false;
        }
        
        if(!tournament.players || !tournament.players.length) {
            return true;
        }
        
        var showBtn = true;
        tournament.players.forEach((player) => {
            if(player._id == playerId) {
                showBtn = false;
            }
        })
        
        return showBtn;
    }
    
    
    _checkJoined(tournament: any, playerId: string) {
        var showBtn = false;
        
        if(!tournament.players || !tournament.players.length) {
            return false;
        }
        
        tournament.players.forEach((player) => {
            if(player._id == playerId) {
                showBtn = true;
            }
        })
        
        return showBtn;
    }
    
    _setJoinClass(tAmount: any, pBallance: any) {
        tAmount = parseInt(tAmount);
        pBallance = parseInt(pBallance);
        return (tAmount <= pBallance) ? "btn btn-success" : "btn btn-warning";
    }

    _savePlayer(data: any, position: number) {
        this.homeService.insertPlayer(data).subscribe((result: any) => {
            if (result.status == 'success') {
                this.players[position] = new Player(result.player);
            }
        });
    }

    _getPlayers() {
        this.homeService.getPlayers().subscribe((result: any) => {
            if (result.status == 'success') {
                this.players = [];
                this.playersData = {};
                
                result.players.forEach((player) => {
                    var newPlayer = new Player(player);
                    this.players.push(newPlayer);
                    this.playersData[player._id] = newPlayer;
                });
            }
        });
    }
    
    _getTournaments() {
        this.homeService.getTournaments().subscribe((result: any) => {
            if (result.status == 'success') {
                this.tournaments = result.tournaments;
                this._getBackers();
            }
        });
    }
    
    _getBackers() {
        this.tournaments.forEach((T) => {          
            this.tournamentsBakers[T._id.toString()] = {};;
            this.players.forEach((P) => {
                this.tournamentsBakers[T._id.toString()][P._id.toString()] = this._checkBacker(T.players, P._id);
            });
        });
    }
    
    _checkBacker(players: any, playerID: string) {
        if(!players || !players.length) {
            return false;
        }
        
        var exists = false;
        players.forEach((P) => { 
            if(P.backers && P.backers.length) {
                P.backers.forEach((B) => {
                    if(B._id.toString() == playerID.toString()) {
                        exists = true;
                    }
                });
            }
        })
        return exists;
    }
}
