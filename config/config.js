var _ = require('underscore');

// Application Config
module.exports = _.extend(
        require(__dirname + '/../config/env/all.js'),
        require(__dirname + '/../config/env/' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'local') + '.json') || {},
        require(__dirname + '/../config/env/env-defined.js'));
