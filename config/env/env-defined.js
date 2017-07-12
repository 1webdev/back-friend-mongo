'use strict';

//
// Set configuration parameters based on env variables
// command-line set env variables should take precedence over config files
//

module.exports = {};


// Port
if (process.env.PORT)
    module.exports.port = process.env.PORT;

// Domain
if (process.env.DOMAIN)
module.exports.domain = process.env.DOMAIN;
