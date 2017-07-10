'use strict';
var ObjectId = require('mongodb').ObjectID;
var tournamentHelper = require(_root + '/lib/tournament');


exports.getAll = function (req, res, next) {

    var db = req.app.locals.db;
    var collection = db.collection('tournaments');
    collection.find({}).toArray(function (err, tournaments) {

        var output = {status: 'error'};
        if (!err) {
            output = {status: 'success', tournaments: tournaments};
        }
        res.json(output);
        return null;
    });
}

exports.resultTournament = function (req, res, next) {
    var db = req.app.locals.db;
    var collection = db.collection('tournaments');
    var collectionPlayer = db.collection('players');
    
    var tournamentId = req.params.id;
        
    var searched = {_id: new ObjectId(tournamentId)};
    collection.findOne(searched, function (err, tournament) {
        if (err || !tournament) {
            var output = {status: 'error'};
            res.json(output);
            return null;
        } 
        
        var players = tournament.players || [];
        if(!players || players.length < 2) {
            var output = {status: 'error', 'error': 'no_players'};
            res.json(output);
            return null;
        }
        
        var winner = players[Math.floor(Math.random()*players.length)];
        var winAmount = players.length * tournament.amount;
        
        if(winner.backers && !winner.backers.length) {
            changeBallance(db, winner._id, winAmount);
        } else {
            var countBackers = winner.backers.length + 1;
            var eachAmount = parseInt(winAmount / countBackers);
            
            winner.backers.forEach((B) => {
                changeBallance(db, B._id, eachAmount);
            });
            changeBallance(db, winner._id, eachAmount);
        }
        
        var data = {status: 'played', winner: {_id: winner._id}};
        collection.update(
            searched,
            {$set: data},
            function (err, document) {
                if (err) {
                    var output = {status: 'error'};
                    res.json(output);
                    return null;
                }
                
                var output = {status: 'success'};
                res.json(output);
                return null;  
            }
        );
        
    });
}


exports.joinTournament = function (req, res, next) {

    var db = req.app.locals.db;
    var collection = db.collection('tournaments');
    var collectionPlayer = db.collection('players');

    var tournamentId = req.params.id;
    var player = req.body;

    var searched = {_id: new ObjectId(tournamentId)};
    collection.findOne(searched, function (err, tournament) {
        if (err || !tournament) {
            var output = {status: 'error'};
            res.json(output);
            return null;
        }

        var searchedPlayer = {_id: new ObjectId(player._id)};
        collectionPlayer.findOne(searchedPlayer, function (err, playerInfo) {
            if (err || !playerInfo) {
                var output = {status: 'error'};
                res.json(output);
                return null;
            }

            var isExists = tournamentHelper.checkPlayerExists(tournament.players, playerInfo._id);            
            if(isExists) {
                var output = {status: 'error', error: 'is_backer'};
                res.json(output);
                return null;
            }

            //if player has enough coins to join
            var result = tournamentHelper.checkSimplePlayer(tournament, playerInfo);
            if (result) {
                
                var players = (tournament.players) ? tournament.players : [];
                players.push({_id: player._id, backers: []});
                var data = {players: players};

                collection.update(
                    searched,
                    {$set: data},
                    function (err, document) {
                        if (err) {
                            var output = {status: 'error'};
                            res.json(output);
                            return null;
                        }
                        var newBallance = (parseInt(playerInfo.ballance) - parseInt(tournament.amount));
                        var data = {ballance: newBallance};
                        collectionPlayer.update(
                            searchedPlayer,
                            {$set: data},
                            function (err, document) {
                                var output = {status: 'success'};
                                res.json(output);
                                return null;
                            }
                        );
                    }
                );

            } else {

                var ids = [];
                ids.push(new ObjectId(player._id));
                if (tournamentHelper.players.length) {
                    tournamentHelper.players.forEach((id) => {
                        ids.push(new ObjectId(id));
                    });
                }

                var findQuery = {_id: {$nin: ids}, ballance: {$gt: 0}}
                collectionPlayer.find(findQuery).toArray(function (err, players) {
                    if (!players || !players.length) {
                        var output = {status: 'error', error: 'no_backers'};
                        res.json(output);
                        return null;
                    }

                    var backersIDs = tournamentHelper.checkBackerPlayer(tournament, players, playerInfo);
                    if (!backersIDs.length) {
                        var output = {status: 'error', error: 'no_backers'};
                        res.json(output);
                        return null;
                    }

                    var amount2join = tournamentHelper.getAmount(tournament, backersIDs.length);
                    var backersIDsUpdate = [];
                    backersIDs.forEach((backer) => {
                        changeBallance(db, backer, ((amount2join)*(-1)));
                        backersIDsUpdate.push({_id: backer});
                    });

                    changeBallance(db, playerInfo._id, ((amount2join)*(-1)));

                    var tournamentPlayers = (tournament.players) ? tournament.players : [];
                    tournamentPlayers.push({_id: player._id, backers: backersIDsUpdate});
                    var data = {players: tournamentPlayers};
                                        
                    collection.update(
                        searched,
                        {$set: data},
                        function (err, document) {
                            if (err) {
                                var output = {status: 'error1'};
                                res.json(output);
                                return null;
                            }

                            var output = {status: 'success'};
                            res.json(output);
                            return null;

                        }
                    );

                });
            }
        });
    });

}

exports.insertTournament = function (req, res, next) {

    var db = req.app.locals.db;
    var collection = db.collection('tournaments');

    validateTournament(req, res, function () {

        var data = {amount: req.body.amount, status: 'open'};
        collection.insert(data, function (err, result) {
            if (result && result.ops && result.ops[0]) {
                res.json({status: 'success', tournament: result.ops[0]});
                return null;
            }
        });
    });
}

function changeBallance(db, playerID, amount) {
    var collectionPlayer = db.collection('players')
    var searchedPlayer = {_id: new ObjectId(playerID)};
    collectionPlayer.findOne(searchedPlayer, function (err, playerInfo) {
        var newBallance = (parseInt(playerInfo.ballance) + parseInt(amount));
        var data = {ballance: newBallance};
        collectionPlayer.update(
            searchedPlayer,
            {$set: data},
            function (err, document) {
                return true;
            }
        );
    });
}


function validateTournament(req, res, cb) {
    req.checkBody({
        amount: {
            notEmpty: {
                errorMessage: 'amount-required'
            },
            isInt: {
                errorMessage: 'amount-int'
            }
        }
    });

    var errors = req.validationErrors();

    if (errors) {
        var response = {status: 'error', error: errors};
        res.json(response);
    } else {
        cb();
    }
}


