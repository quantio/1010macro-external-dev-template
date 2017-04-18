module.exports = function (grunt) {

  var buildConfig = require('../build.config.js');
  var _ = require('lodash');

  var quickQueryWatchers = _.reduce(buildConfig['quick_queries'], function asFileWatcher(acc, obj, name) {
    var tasks = ['tendo:' + name];
    if (obj.dest)
      tasks.unshift('template:' + name);

    acc[name] = {
      files: obj.src,
      tasks: tasks
    };
    return acc;
  }, {});

  return _.extend({
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true,
        livereloadOnError: false,
        spawn: false
      },

      html: {
        files: ['<%= quick_queries.hello_world.container %>'],
        tasks: ['build']
      },

      specs: {
        files: ['src/**/*.spec.js'],
        tasks: ['build'],
        options: {
          livereload: false
        }
      },

      config_files: {
        files: ['Gruntfile.js', 'tasks/**/*.js', 'build.config.js'],
        tasks: ['build'],
        options: {
          reload: true
        }
      },

      gruntfile: {
        files: ['Gruntfile.js', 'tasks/**/*.js', 'build.config.js'],
        options: {
          reload: true,
          livereload: false
        }
      },

      weather: {
        files: ['src/queries/weather.xml'],
        tasks: ['tendo:weather']
      }
    },

    // watch all defined quick_queries
    quickQueryWatchers);
};
