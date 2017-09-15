'use strict';

module.exports = function (grunt) {
  var _ = require('lodash');
  process.env.project_dir = __dirname;

  /**
   * Loads all config files that start with "config." (configs can export a function(grunt) or object)
   */
  function loadTaskConfigs(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('configure.*.js', {cwd: path}).forEach(function (config) {
      key = config.replace(/\.js$/, '').replace('configure.', '');
      var o = require(path + config);
      object[key] = (typeof(o) === 'function') ? o(grunt) : o;
    });

    return object;
  }

  /**
   * Loads all grunt plugins in package.json. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // removed in favor of an easier way to override per env inside of build.config.js
  // var gateway = grunt.option('g') || process.env['TENTENGW'] || 'https://www2.1010data.com/' + platform_version + '/gw';
  var login_id = grunt.option('u') || process.env['TENTENUID'];
  if (!login_id)
    grunt.fatal('Login ID not specified via "-u" cmd line arg or specified as environment variable "TENTENUID"');

  var login_password = grunt.option('p') || process.env['TENTENPW'];
  if (!login_password)
    grunt.fatal('Password not specified via "-p" cmd line arg or specified as environment variable "TENTENPW"');

  var envConfig = require('./env.config.js')(grunt);

  // build, tokenize and cache platform file auto-managed configurations
  envConfig.quick_queries = envConfig.util.build("quick_queries", envConfig.quick_queries, envConfig);

  grunt.initConfig(
    grunt.util._.extend({
        login_id: login_id,
        login_password: login_password
      },
      envConfig, // build info
      grunt.file.readJSON('package.json'), // app/package info
      loadTaskConfigs('./tasks/') // task configs
    )
  );

  grunt.loadTasks('tasks'); // load custom task files in the tasks folder

  grunt.registerTask('default', ['serve']); // default task in none specified on cmd line

  grunt.registerTask('build', [ // builds html containers
    'clean:build',
    'template'
  ]);

  grunt.registerTask('unit_tests', [
    'clean:build',
    'template',
    'jasmine_nodejs:unit_tests'
  ]);

  grunt.registerTask('e2e_tests', [
    'clean:build',
    'template',
    'webdriver:e2e_tests'
  ]);

  grunt.registerTask('short_delay', 'avoids "ACCUM" error after running create_folders query', function (target) {
    var done = this.async();
    setTimeout(done, 5000);
  });

  // builds, creates folders and deploy the app
  grunt.registerTask('deploy', [
    'clean:build',
    'template', // tokenize files
    'create_folders:build',
    'tendo:create_folders',
    'short_delay',
    'deploy_all_quick_queries'
  ]);

  // creates a deploy task from all 'quick_queries' defined in build.config.js
  grunt.registerTask('deploy_all_quick_queries', envConfig.util.buildTendoTasks('quick_queries'));

  // runs tjhe weather query via tendo
  grunt.registerTask('weather', [
    'tendo:weather'
  ]);

  grunt.registerTask('serve', 'Compile then start a "connect" web server', function (target) {
    grunt.task.run([
      'build',
      'connect:livereload',
      'watch'
    ]);
  });
};
