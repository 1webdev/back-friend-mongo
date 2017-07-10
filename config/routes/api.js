'use strict';
/**
 * API
 * Routes that manage API methods
 */

var config = require(_root + '/config');
var express = require('express');
var router = express.Router();
var appApi = require(_root + '/app/api');

module.exports = function (app) {

    router.route('/players').get(appApi.players.getAll);
    router.route('/player').post(appApi.players.insertPlayer);
    router.route('/player/:id').put(appApi.players.addCoins);
    router.route('/playerBallance/:id').get(appApi.players.getBallance);
    
    router.route('/tournament').post(appApi.tournaments.insertTournament);
    router.route('/tournament/:id').put(appApi.tournaments.joinTournament);
    router.route('/tournaments').get(appApi.tournaments.getAll);

    router.route('/resultTournament/:id').post(appApi.tournaments.resultTournament);
    
    router.route('/reset').get(appApi.players.reset);
  
    app.use('/api', router);
}