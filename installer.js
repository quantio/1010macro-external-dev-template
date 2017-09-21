var childProcess = require('child_process');
var path = require('path');

function exec(cmd, callback) {
  childProcess.exec(cmd, function (error, stdout, stderr) {
    if (error)
      return callback(error);

    if (stderr && stderr.length > 0)
      callback(null, stderr);
    else
      callback(null, stdout);
  });
}


function withEnv(executable, envVar) {
  var fullPath = '';
  if (process.env[envVar])
    fullPath = path.join(process.env[envVar], executable);
  else
    fullPath = executable;
  if (process.platform.indexOf('win') == 0)
    fullPath += '.exe';
  return '"' + fullPath + '"';
}

/**
 * callback(err,version) = 'err' if not installed, version installed
 */
function findJavaVersion(callback) {
  exec('java -version', function (err, data) {
    if (err)
      return callback(err);

    data = data.toString().split('\n')[0];
    var javaVersion = new RegExp('java version').test(data) ? data.split(' ')[2].replace(/"/g, '') : false;
    if (javaVersion != false)
      return callback(null, javaVersion.trim());
    else
      return callback('not installed');
  });
}

/**
 * callback(err,version) = 'err' if not installed, version installed
 */
function findTendoVersion(callback) {
  exec(withEnv('tendo', 'TENDO_HOME') + ' --version', function (err, data) {
    if (err)
      return callback(err);

    var match = /ver:  ([0-9_]*)/.exec(data);
    if (match)
      return callback(null, match[1]);
    else
      return callback('unable to determine tendo version');
  });
}

/**
 * callback(err,version) = 'err' if not installed, version installed
 */
function findTenupVersion(callback) {
  exec(withEnv('tenup', 'TENUP_HOME') + ' --version', function (err, data) {
    if (err)
      return callback(err);

    var match = /Version: ([0-9_]*)/.exec(data);
    if (match)
      return callback(null, match[1]);
    else
      return callback('unable to determine tenup version');
  });
}

function findGruntCLIVersion(callback) {
  exec('grunt -version', function (err, data) {
    if (err)
      return callback(err);

    var match = /v([0-9.]*)/.exec(data);
    if (match)
      return callback(null, match[1]);
    else
      return callback('unable to determine grunt cli version');
  });
}

function findCredentialsInEnv() {
  return {
    hasEnv_TENTENUID: process.env['TENTENUID'] ? true : false,
    hasEnv_TENTENPW: process.env['TENTENPW'] ? true : false
  };
}

function mark(obj, name, callback) {
  return function (err, version) {
    obj[name] = err || version;
    callback();
  }
}

function generateReport(callback) {
  var report = findCredentialsInEnv();
  findJavaVersion(mark(report, 'java', function () {
    findTendoVersion(mark(report, 'tendo', function () {
      findTenupVersion(mark(report, 'tenup', function () {
        findGruntCLIVersion(mark(report, 'grunt-cli', function () {
          callback(report);
        }));
      }));
    }));
  }));
}


generateReport(function (report) {
  console.log(report);
});
