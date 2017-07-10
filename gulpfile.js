'use strict';
/* jshint unused:false */

var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var dir = require('./.gulp/dir');

gulp.task('app', function() {
    return nodemon({
            script: 'server.js',
            execMap: {
                js: 'node --harmony'
            },
            ignore: [
                'README.md',
                'node_modules/**',
                dir.client,
                dir.dist,
            ],
            watchedExtensions: ['js', 'json', 'html'],
            watchedFolders: [dir.app, 'config', 'views'],
            debug: true,
            delayTime: 1,
            env: {
                NODE_ENV: 'local',
                PORT: 3015,
            }
        });
});

// Restart the app server
gulp.task('app-restart', function() {
    nodemon.emit('restart');
});

/** Build it all up and serve it */
gulp.task('default', ['app']);
