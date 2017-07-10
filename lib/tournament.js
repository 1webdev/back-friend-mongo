'use strict';

var tournamentHelper = {

    players: [],

    checkSimplePlayer: function (tournament, player) {
        var players = (tournament.players) ? tournament.players : [];
        this.setupPlayers(players);
        if (tournament.amount <= player.ballance) {
            return !this.inArray(player._id, this.players);
        }
        
        return false;
    },

    getAmount: function(tournament, backersCount) {
        return tournament.amount / (backersCount + 1);
    },

    checkPlayerExists: function(players, playerID) {
        
        if(!players || !players.length) {
            return false;
        }
        
        var exists = false;
        players.forEach((P) => {
            if(P._id.toString() == playerID.toString()) {
                exists = true;
            }
            
            if(P.backers && P.backers.length) {
                P.backers.forEach((B) => {
                    if(B._id.toString() == playerID.toString()) {
                        exists = true;
                    }
                });
            }
        })
        return exists;
    },

    checkBackerPlayer: function(tournament, backersPlayers, player) {
        if(!backersPlayers.length) {
            return [];
        }
        
        var amount2join = this.getAmount(tournament, backersPlayers.length);
        if(amount2join > player.ballance) {
            return [];
        }
        
        var checkedPlayers = [];
        backersPlayers.forEach((P) => {
            if(P.ballance > amount2join) {
                checkedPlayers.push(P);
            }
        });
        
        if(backersPlayers.length != checkedPlayers.length) {
            return this.checkBackerPlayer(tournament, checkedPlayers, player);
        }
        
        var backers = [];
        checkedPlayers.forEach((P) => {
            backers.push(P._id);
        });
        
        return backers;
    },

    setupPlayers: function (players) {
        players.forEach((player) => {
            this.players.push(player._id);
        });
    },

    inArray: function (what, where) {
        for (var i = 0, length_array = where.length; i < length_array; i++)
            if (what == where[i])
                return true;
        return false;
    }

}

module.exports = tournamentHelper;
