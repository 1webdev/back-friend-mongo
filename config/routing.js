'use strict';
/**
 * Routing
 * Setup request routing
 */

module.exports = function (app, db) {

    // Allow all domains
    app.use(function (req, res, next) {

        var allowedMethods = [
            'GET', 'POST', 'OPTIONS',
            'PUT', 'PATCH', 'DELETE',
        ];

        var allowedHeaders = [
            'Origin',
            'Accept',
            'Content-Type',
            'X-Requested-With',
            'X-HTTP-Method-Override',
        ];

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
        res.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
        res.header('Access-Control-Allow-Credentials', true);
        if (req.method === 'OPTIONS')
            return res.send();

        next();
    });
    
    // Routes handling api requests
    require(_root + '/config/routes/api')(app);
    require(_root + '/config/routes/controller')(app);

};
