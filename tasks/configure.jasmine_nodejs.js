module.exports = function (grunt) {
  var teamcity = grunt.option("teamcity") === true;

  return {
    test_queries: {
      options: {
        useHelpers: true,
        teamcity: teamcity
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
