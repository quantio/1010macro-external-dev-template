beforeEach(function () {

  var helper = this;

  // to override set a higher timeout in your spec.js
  if (jasmine.DEFAULT_TIMEOUT_INTERVAL < 10000)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

  var fs = require("fs");
  var _ = require('lodash');
  var tendo = require('tendo');

  helper.tendo = tendo;

  helper.query = function (options, file, callback) {
    var defaultOptions = {
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
    };

    var pipe = process.platform.indexOf('win') == 0 ? '^|' : '|';
    var opts = _.extend(defaultOptions, options);
    if (opts.params) {
      opts.args = _.reduce(opts.params, function (acc, value, key) {
        return helper.withParam(acc, key, value);
      }, opts.args || '');
      delete opts.params;
    }

    var query = (opts.isInlineQuery === true) ? file.replace(/"/g, '\\"').replace(/\|/g, pipe).replace(/(?:\r\n|\r|\n)/g, '') : '@' + process.env.project_dir + '/' + file;
    tendo.execute(opts, [query], function (status, results) {
      if (status === false)
        throw new Error(results);

      callback(results[0]);
    });
  };

  helper.queryToJson = function (options, file, callback) {
    options.args = options.args ? options.args + ' -h' : '-K -h';
    options.resultsAsJson = true;

    helper.query(options, file, callback);
  };

  helper.queryQuickAppToJson = function (options, file, callback) {
    var tempFile = '<%= build_dir %>/temp_tendo_results.csv';

    options.args = options.args ? options.args + ' -h' : '-K -h';
    options.args += ' --lenient --data="' + tempFile + '"';

    helper.query(options, file, function () {
      var resultAsJson = tendo.resultToJson(helper.readFileToString(tempFile), options.newLineDelimiter, options.colDelimiter);
      callback(resultAsJson);
    });
  };

  helper.readFileToString = function (file, encoding) {
    return fs.readFileSync(file, encoding || "utf8").toString();
  };

  helper.withParam = function (args, name, value) {
    return args + ' -[[' + name + ']]="' + value + '"';
  }

});
