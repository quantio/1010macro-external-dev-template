module.exports = function (grunt) {
  var envConfig = require('../env.config.js')(grunt);

  return {
    build: envConfig.init_queries.create_folders
  };
};