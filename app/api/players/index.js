'use strict';
var ObjectId = require('mongodb').ObjectID;


exports.getAll = function (req, res, next) {

    var db = req.app.locals.db;
    var collection = db.collection('players');
    collection.find({}).toArray(function (err, players) {

        var output = {status: 'error'};
        if (!err) {
            output = {status: 'success', players: players};
        }
        res.json(output);
        return null;
    });

}

exports.reset = function (req, res, next) {

    var db = req.app.locals.db;
    
    var collection = db.collection('tournaments');
    var collectionPlayer = db.collection('players');
    
    collection.remove();
    collectionPlayer.remove();
    var output = {status: 'success'};
    res.json(output);
    return null;
}

exports.getBallance = function (req, res, next) {

    var db = req.app.locals.db;
    var collection = db.collection('players');
    var playerId = req.params.id;
    
    var searched = {_id: new ObjectId(playerId)};
    collection.findOne(searched, function (err, player) {
        if (err || !player) {
            var output = {status: 'error'};
            res.json(output);
            return null;
        } 
        
        res.json({status: 'success', player: player});
        return null;
    });

}


exports.addCoins = function (req, res, next) {

    var playerId = req.params.id;

    var db = req.app.locals.db;
    var collection = db.collection('players');
    var searched = {_id: new ObjectId(playerId)};
    collection.findOne(searched, function (err, player) {
        if (err) {
            var output = {status: 'error'};
            res.json(output);
            return null;
        }
        
        var action = req.body.action || 'fund';
        var amount = parseInt(req.body.amount) || 0;
        var newBallance = (action == 'fund') ? parseInt(player.ballance) + amount : parseInt(player.ballance) - amount;

        collection.findOneAndUpdate(
            searched,
            {$set: {ballance: newBallance}},
            function (err, document) {
                if (err) {
                    var output = {status: 'error'};
                    res.json(output);
                    return null;
                }

                document.value.ballance = newBallance;
                res.json({status: 'success', player: document.value});
                return null;
            }
        );
    });

}


exports.insertPlayer = function (req, res, next) {

    var db = req.app.locals.db;
    var collection = db.collection('players');

    validatePlayer(req, res, function () {
        collection.insert(req.body, function (err, result) {
            if (result && result.ops && result.ops[0]) {
                res.json({status: 'success', player: result.ops[0]});
                return null;
            }
        });
    });
}

function validatePlayer(req, res, cb) {
    req.checkBody({
        name: {
            notEmpty: {
                errorMessage: 'name-required'
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


