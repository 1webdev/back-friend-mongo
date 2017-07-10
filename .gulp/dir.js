// Configuration Directories
var dirs = {
    app:    'app',
    client: 'client',
    config: 'config',
    dist:   'dist',
};

dirs.scripts = {
    src:        dirs.client + '/scripts',
    compiled:   dirs.client + '/js',
    dist:       dirs.dist + '/js',
};

dirs.styles = {
    src:        dirs.client + '/sass',
    compiled:   dirs.client + '/css',
    dist:       dirs.dist + '/css',
};

dirs.images = {
    src:        dirs.client + '/img',
    compiled:   dirs.dist + '/img',
    dist:       dirs.dist + '/img',
};

dirs.fonts = {
    src:        dirs.client + '/fonts',
    compiled:   dirs.dist + '/fonts',
    dist:       dirs.dist + '/fonts',
};

module.exports = dirs;
