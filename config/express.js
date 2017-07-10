'use strict';

var bodyParser = require('body-parser');
var validator = require('express-validator');

//require(_root + '/config/promises');


module.exports = function (app) {

    app.set('json spaces', 2);
    app.set('showStackError', true);
    app.enable('jsonp callback');

    app.use(require('method-override')());
    app.use(require('compression')());

//     parse application/json requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(validator({
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            },
            isObject: function (value) {
                return typeof value === 'object';
            },
            gte: function (param, num) {
                return param >= num;
            },
            gt: function (param, num) {
                return param > num;
            },
            eq: function (param, num) {
                return param == num;
            }
        }
    }));

    // Continue to routing,
    require(_root + '/config/routing')(app);

    //require(_root + '/config/errors')(app);
};
