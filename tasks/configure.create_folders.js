module.exports = function (grunt) {
  var buildConfig = require('../env.config.js')(grunt);
  var _ = require('lodash');

  grunt.registerMultiTask('create_folders', 'Create 1010 folders from quick_queries', function () {
    var options = this.options({}, this.data);
    var quickQueries = grunt.config('quick_queries');
    var id = 0;

    function buildPaths(path, paths) {
      var o = {
        parent: '0',
        path: path,
        depth: path.split('.').length
      };

      paths.push(o);
      var hasParent = path.indexOf('.') != -1;
      if (hasParent) {
        o.parent = path.substring(0, path.lastIndexOf('.'));
        return buildPaths(o.parent, paths)
      }

      return paths;
    }

    var folders = _.chain(quickQueries)
      .map(function (o) {
        var file = o.table.substring(0, o.table.indexOf('('));
        var path = file.substring(0, file.lastIndexOf('.'));
        return _.map(buildPaths(path, []), function (p) {
          p.id = id++;
          p.title = o.folderLabel || o.title || p.path.substring(p.path.lastIndexOf('.') + 1);
          return p;
        });
      })
      .reduce(function (acc, obj, name) {
        return acc.concat(obj);
      }, [])
      .uniqBy('path')
      .sortBy(['depth', 'asc'])
      .value();

    var users = (options.users || '');
    users = (users === 'inherit' || users === 'private') ? users : users.split(',').map(function(u){return u.trim()});
    grunt.file.copy(options.template, options.dest, {
      process: function (contents) {
        return grunt.template.process(contents, {
          data: {
            folders: folders,
            users: users
          }
        });
      }
    });
  });

  return {
    build: buildConfig.init_queries.create_folders
  };
};