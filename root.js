'use strict';

var path = require('path'),
    basePath = path.normalize(__dirname);

module.exports = global._root = basePath;
