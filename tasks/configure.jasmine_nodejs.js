module.exports = function (grunt) {
  return {
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
