'use strict';

// Module Dependencies
var express = require('express'),
        fs = require('fs'),
        http = require('http');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';
var config = require('./config/config');
var MongoClient = require('mongodb').MongoClient;


var app = express();

// Configuration
require('./config/express')(app);


MongoClient.connect(config.db.url, function (err, db) {
    if(err) {
        throw err;
    }

    app.locals.db = db;
    app.listen(config.port, () => {
        console.log('run node server');
    });
});

