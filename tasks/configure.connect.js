module.exports = function (grunt) {

    /**
     * Starts a local http server to serve up the build folder as the root folder.  Any tokenized html files can be found here.
     * Also connects to livereload pluging to automatically refresh browser windows when tasks have finished.
     */
    var buildConfig = require('../env.config.js')(grunt);
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');

    return {
        options: {
            port: 8000,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost'
            //livereload: 35729
        },

        livereload: {
            options: {
                open: {
                    target: 'http://localhost:8000/hello.world.html',
                    appName: 'open'
                },
                port: 8000,
                target: 'http://localhost:8000/hello.world.html',
                middleware: function (connect) {
                    return [
                        serveStatic(buildConfig["build_dir"]),
                        serveStatic(buildConfig["app_dir"]),
                        serveIndex(buildConfig["build_dir"], {'icons': true})
                    ];
                }
            }
        }
    }
};
