beforeEach(function () {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

  var fs = require("fs");
  var _ = require('lodash');
  var tendo = require('tendo');
  this.tendo = tendo;

  this.query = function (options, file, callback) {
    var defaultOptions = {
      login: {
        'TENTENGW': '<%= login.gateway %>',
        'TENTENUID': '<%= login.id %>',
        'TENTENPW': '<%= login.password %>'
      },
      args: '-K',
      logResults: true,
      logTenDoCmd: false,
      table: 'default.lonely',
      isInlineQuery: false
    };

    var pipe = process.platform.indexOf('win') == 0 ? '^|' : '|';
    var opts = _.extend(defaultOptions, options);
    var query = (opts.isInlineQuery === true) ? file.replace(/"/g, '\\"').replace(/\|/g, pipe).replace(/(?:\r\n|\r|\n)/g, '') : '@' + process.env.project_dir + '/' + file;
    tendo.execute(opts, [query], function (status, results) {
      if (status === false)
        throw new Error(results);

      callback(results[0]);
    });
  };

  this.queryToJson = function (options, file, callback) {
    options.args = options.args ? options.args + ' -h' : '-K -h';
    options.resultsAsJson = true;

    this.query(options, file, callback);
  };

  this.queryQuickAppToJson = function (options, file, callback) {
    var tempFile = '<%= build_dir %>/temp_tendo_results.csv';

    options.args = options.args ? options.args + ' -h' : '-K -h';
    options.args += ' --lenient --data="' + tempFile + '"';

    this.query(options, file, function () {
      var resultAsJson = tendo.resultToJson(this.readFileToString(tempFile), options.newLineDelimiter || /\r\n|\n/, options.colDelimiter || ',');
      callback(resultAsJson);
    }.bind(this));
  };

  this.readFileToString = function (file) {
    return fs.readFileSync(file, "utf8").toString();
  };
});