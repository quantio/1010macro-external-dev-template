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
    developer: {},
    ci: {
      // root_path: 'pub.consumer_data.oi.ecom.ci',
      // platform_version: 'beta-latest'
    },
    test: {
      // root_path: 'pub.consumer_data.oi.ecom.test',
      // login_gateway: 'https://njtest.corp.1010data/beta-latest/gw',
      // login_gateway_host: 'https://njtest.corp.1010data.com'
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

  /**
   * 1010data credentials
   */
  login: {
    gateway: '<%= login_gateway %>',
    id: '<%= login_id %>',
    password: '<%= login_password %>'
  },

  root_path: 'pub.consumer_data.oi.internal.workspace.<%= login.id %>.hello_world',
  basetable: 'default.lonely',

  init_queries: {
    create_folders: {
      table: '<%= basetable %>',
      template: 'src/_init/template_create_folders.xml',
      dest: '<%= build_dir %>/_init/create_folders.xml', // tokenize template to dest using 'template' task
      // users: 'oi_ecom_internal_users',
      users: 'inherit',
      options: {
        args: '-k' // force a new session which ensures folder caches are cleared
      }
    }
  },

  quick_queries: {
    hello_world: {
      container: '<%= app_dir %>/hello.world.html',   // html iframe container
      src: '<%= app_dir %>/hello.world.xml',
      dest: '<%= build_dir %>/app/hello.world.xml',  // tokenize src to dest using 'template' task
      title: 'Hello World Example App',
      name: '<%= root_path %>.main',
      url: '<%= login_gateway_host %>/cgi-bin/<%= platform_version %>/quickapp?path=<%= quick_queries.hello_world.name %>',
      table: '<%= quick_queries.hello_world.name %>\(<%= quick_queries.hello_world.title %>\;\;\)=<%= basetable %>',
      ordinal: 99 // deploy last because there are dependencies which must be deployed beforehand
    },

    lib1: {
      table: '<%=root_path%>.lib1.lib1\(Library 1\;\;\)=<%= basetable %>',
      src: ['<%= app_dir %>/lib1/lib1.xml']
    },

    lib2: {
      table: '<%=root_path%>.lib2.lib2\(Library 2\;\;\)=<%= basetable %>',
      src: ['<%= app_dir %>/lib2/lib2.xml'],
      options: {
        args: '-K -y --query -[[DATE_TEST]]="' + new Date().toString() + '"'
      }
    }
  }
};
