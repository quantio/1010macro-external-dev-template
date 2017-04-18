module.exports = function (grunt) {
  var teamcity = grunt.option("teamcity") === true;

  return {
    options: {
      reporters: {
        teamcity: teamcity
      }
    },
    test_queries: {
      options: {
        useHelpers: true
      },
      specs: [
        "build/**/*.spec.js"
      ],
      helpers: [
        "<%= build_dir %>/tendo.helper.js"
      ]
    }
  }
};
