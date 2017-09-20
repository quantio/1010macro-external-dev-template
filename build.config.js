/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   *   example of structures to override variables for environments. The default environment config is 'developer'
   *
   *  Example to deploy using the "ci" settings
   *    grunt deploy -env=ci
   */
  env_configs: {
    developer: {
      // platform_version: 'primerc'
    },
    ci: {
      // root_path: 'pub.consumer_data.oi.ecom.ci',
      // platform_version: 'beta-latest'
    },
    test: {
      // root_path: 'pub.consumer_data.oi.ecom.test',
      // platform_version: 'beta-latest'
      // platform_gateway_host: 'https://njtest.corp.1010data.com'
    },

    beta: {
      // root_path: 'pub.consumer_data.oi.ecom.beta',
    },

    prod: {
      // root_path: 'pub.consumer_data.oi.ecom.client_portal',
      // platform_version: 'prime-latest'
    }
  },

  /**
   * The `build_dir` folder is where the projects html files are compiled too
   */
  build_dir: 'build',
  app_dir: 'src/app',

  platform_version: 'prime-latest',
  platform_gateway_host: 'https://www2.1010data.com',
  quickapp_path: '<%= platform_gateway_host %>/cgi-bin/<%= platform_version %>/quickapp?path=',

  /**
   * 1010data credentials
   */
  login: {
    gateway: '<%= platform_gateway_host %>/<%= platform_version %>/gw',
    id: '<%= login_id %>',
    password: '<%= login_password %>'
  },

  root_path: 'pub.consumer_data.oi.internal.workspace.<%= login.id %>.hello_world',
  basetable: 'default.lonely',

  init_queries: {
    create_folders: {
      table: '<%= basetable %>',
      dest: '<%= build_dir %>/_init/create_folders.xml', // tokenize template to dest using 'template' task
      // users: 'oi_ecom_internal_users',
      users: 'inherit',
      options: {
        args: '-k' // force a new session which ensures folder caches are cleared
      },
      file_configs: ['quick_queries']
    }
  },

  // auto-managed quick_queries via file patterns
  quick_queries: [{
    cwd: '<%= app_dir %>', // any grunt.file.expand settings (see https://gruntjs.com/api/grunt.file)
    src: ['**/*.xml', '!**/temp_*.xml'], // any list of grunt file patterns
    build_dir: '<%= build_dir %>/app',

    // build_dir: '', // optional (default is to use the build.config build_dir)
    // root_path: '', // optional (default is to use the build.config root_path)
    // basetable: '', // optional (default is to use the build.config basetable)

    overrides: [{
      file: 'hello_world.xml',  // required - indicates which file to provide overrides for
      title: 'Hello World Example App',
      container: '<%= app_dir %>/hello_world.html',   // html iframe container
      ordinal: 99 // deploy last because there are dependencies which must be deployed beforehand
    }, {
      file: 'lib2/lib2.xml',  // required - indicates which file to provide overrides for
      // example overriding tendo arguments for this file
      options: {
        args: '-K -y -Y "*" --query -[[DATE_TEST]]="' + new Date().toString() + '"'
      }
    }]
  }]

};
