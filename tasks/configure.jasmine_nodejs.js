module.exports = function (grunt) {
  var teamcity = grunt.option("teamcity") === true;

  return {
    options: {
      options: {
        useHelpers: true
      },
      helpers: [
        "<%= build_dir %>/tendo.helper.js"
      ],
      reporters: {
        teamcity: teamcity
      }
    },
    unit_tests: {
      specs: [
        "build/**/*.spec.js",
        "!build/**/*.e2e.spec.js"
      ]
    }
  }
};
