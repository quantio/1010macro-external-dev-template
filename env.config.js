/**
 * Create config which uses the 'env' overrides based on cmd line option: 'env'
 * example:
 *    grunt -env=ci deploy
 */
module.exports = function (grunt) {
  var buildConfig = require('./build.config.js');
  var _ = require('lodash');
  var tenUtil = require('grunt-tenutil')(grunt);

  var env = grunt.option('env') || 'developer';
  var overrides = buildConfig.env_configs[env] || {};

  var config = _.extend(
    buildConfig,
    overrides, {
      env: env
    }, {
      util: tenUtil
    }
  );

  // allow overide of root_path via command line or environment car
  var app_path = grunt.option('a') || process.env['TENTENAPPPATH'];
  if (app_path)
    config.root_path = app_path;

  return config;
};
