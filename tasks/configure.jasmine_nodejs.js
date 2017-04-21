module.exports = function (grunt) {
  var teamcity = grunt.option("teamcity") === true;

  return {
    options: {
      reporters: {
        teamcity: teamcity
      }
    },
    unit_tests: {
      options: {
        useHelpers: true
      },
      specs: [
        "build/**/*.spec.js",
        "!build/**/*.e2e.spec.js"
      ],
      helpers: [
        "<%= build_dir %>/tendo.helper.js"
      ]
    }
  }
};
