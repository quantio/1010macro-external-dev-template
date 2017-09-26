beforeEach(function () {

  var _ = require('lodash');
  var util = require('grunt-tenutil')();
  var helper = this;

  var jasmineHelper = util.createJasmineHelper({
    build_dir: '<%= build_dir %>',
    tendoDefaultOptions: {
      login: {
        'TENTENGW': '<%= login.gateway %>',
        'TENTENUID': '<%= login.id %>',
        'TENTENPW': '<%= login.password %>'
      },
      args: '-K',
      logResults: true,
      logTenDoCmd: true,
      table: 'default.lonely',
      isInlineQuery: false
    }
  });

  _.extend(helper, jasmineHelper);
});
