'use strict';
/**
 * Controller
 * Routes that manage main page methods
 */

var express = require('express');

module.exports = function (app) {
    app.use('/', express.static(_root + '/client/dist'));
}