/**
 * Create config which uses the 'env' overrides based on cmd line option: 'env'
 * example:
 *    grunt -env=ci deploy
 */
module.exports = function (grunt) {
  var buildConfig = require('./build.config.js');
  var _ = require('lodash');

  var env = grunt.option('env') || 'developer';
  var overrides = buildConfig.env_configs[env] || {};

  var config = _.extend(
    buildConfig,
    overrides, {
      env: env
    }, {
      mapSrcOrTokenizedFile: function (src, dest, srcFrom, destFrom, alwaysMerge) {
        srcFrom = srcFrom || 'src';
        destFrom = destFrom || 'dest';
        return function (acc, o, name) {
          var obj = _.cloneDeep(o);
          // use the tokenized file
          if (obj[destFrom]) {
            obj[src] = obj[srcFrom];
            obj[dest] = obj[destFrom];

            acc[name] = obj;
          }

          if (alwaysMerge === true)
            acc[name] = obj;

          return acc;
        }
      }
    }
  );

  // allow overide of root_path via command line or environment car
  var app_path = grunt.option('a') || process.env['TENTENAPPPATH'];
  if (app_path)
    config.root_path = app_path;

  return config;
};
