module.exports = function (grunt) {

  var envConfig = require('../env.config.js')(grunt);
  var _ = require('lodash');

  return _.extend({
      options: {
        data: grunt.config
      },

      build: {
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= quick_queries.hello_world.container %>'],
          dest: '<%= build_dir %>'
        }, {
          expand: true,
          cwd: 'src',
          src: ['**/*.spec.js', '**/*.spec.xml'],
          dest: '<%= build_dir %>'
        }, {
          expand: true,
          src: ['test/*.wdio.conf.js'],
          dest: '<%= build_dir %>'
        }]
      },

      tdd: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['<%= tdd_files.spec_js %>', '<%= tdd_files.spec_xml %>'],
          dest: '<%= build_dir %>'
        }]
      },

      unit_tests: {
        files: [{
          src: ['test/tendo.helper.template.js'],
          dest: '<%= build_dir %>/tendo.helper.js'
        }]
      }
    },

    envConfig.util.get('quick_queries'));
};
