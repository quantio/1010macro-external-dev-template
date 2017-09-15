module.exports = function (grunt) {

  var envConfig = require('../env.config.js')(grunt);
  var _ = require('lodash');

  return _.extend({
      options: {
        login: {
          'TENTENGW': '<%= login.gateway %>',
          'TENTENUID': '<%= login.id %>',
          'TENTENPW': '<%= login.password %>'
        },
        args: '-K -y -Y "*" --query',
        logResults: true,
        logTenDoCmd: true
      },

      // example for manually adding a tendo command
      weather: {
        table: 'pub.demo.weather.pwcodes',
        src: ['src/queries/weather.xml'],
        options: {
          args: '-K'
        }
      }
    },

    // always use the tokenized file, so remap the dest value to src key
    envConfig.util.get('quick_queries', 'dest', 'src'),

    // add all of the initialization quick_queries as available tendo tasks
    envConfig.util.transformKeys(envConfig['init_queries'], 'dest', 'src')
  );
};
