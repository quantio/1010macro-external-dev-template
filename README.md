# 1010macro-ide-command-center-template
Boilerplate template to provide grunt tasks to:
* run a local server to test quickapps in an iframe. When files change upload to 1010 and then refresh browser via [LiveReload](http://livereload.com/).
* deploy application into 1010 (includes creating folders if they do not exist)
* run queries and see the results in console (via tendo)
* run unit tests
* run End-To-End tests (aka integration test / selenium tests)

## Requirements:
* [Nodejs (v6.8.0+)](http://nodejs.org/)
* [Grunt](http://gruntjs.com/)
* [Tendo](http://www.1010data.com/)
* [JDK (Java v8+)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) (for e2e testing)

## Optional
* [LiveReload](https://chrome.google.com/webstore/search/livereload) chrome extension to automatically refresh browser when files change. 

## Getting Started
Install the [Nodejs](http://nodejs.org/), [Grunt](http://gruntjs.com/), [Tendo](http://www.1010data.com/) and [Java](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
  

Install the [Nodejs](http://nodejs.org/) modules used by the project (from the project root folder):
```js
    npm install
```    

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

Install the grunt command line interface (globally):
```js
    npm install -g grunt-cli
```    

## Notes on TenDo
* TenDo tasks are executed via the [grunt-tendo](https://www.npmjs.com/package/grunt-tendo) npm package (which internally uses the [tendo](https://www.npmjs.com/package/tendo) npm package).   The grunt-tendo task configurations are located in 'tasks\configure.tendo.js' and additional configuration values can be found 'build.config.js'.
* To simplify running grunt tasks add your 1010data user name and password to the system environment. Supported Env Vars:
   * TENTENUID
   * TENTENPW
   * TENTENPROXY

   For additional information please see [Setting Environment Variables](https://www2.1010data.com/documentationcenter/beta/TendoUsersGuide/index_frames.html)
* Additional options: 
    * TENDO_HOME = environment variable to the path of the TenDo executable.
    * TENTENAPPPATH = The full path to where the application is or will be deployed to. Also see 'root_path' in the 'build.config.js'.

## Quick usage examples:
Before diving into any of the configs lets see some quick examples!:
 
1. First deploy the app (Note: This task may fail if you do not have the correct folder permssions, please see '[deploy-task](#deploy-task)' docs below):
```js
    grunt deploy
```    

2. Now start the local server, watchers, livereload, etc:
```js
    grunt serve    
```
    
3. Open a Chrome browser and navigate to the developer dashboard (http://localhost:8000/hello_world.html). 

4. Click on the "Hello World Example App" button. This will load the quick app into a new tab.

5. Turn on the [LiveReload](https://chrome.google.com/webstore/search/livereload) extension (located in the upper right hand corner of the chrome browser).

6. Now open 'src/app/hello_world.xml' and change 'Hello World' to 'World Hello' and save.  The serve command will detect the file has change, rebuild it, push it up to 1010 and then refresh the browser ([LiveReload.com](https://chrome.google.com/webstore/search/livereload) extension required).   
   
## Auto-managed quick queries:
Inside of the 'build.config.js' there is a node named 'quick_queries' this is where the auto-managed quick queries are defined.  Each file will automatically have a 'watch', 'tendo' and optionally a 'replace' task created.  
Example:
```js
  quick_queries: [{
      cwd: '<%= app_dir %>', // any grunt.file.expand settings (see https://gruntjs.com/api/grunt.file)
      src: ['**/*.xml', '!**/temp_*.xml'], // any list of grunt file patterns
      build_dir: '<%= build_dir %>/app',
      overrides: []
  }]
```

To override settings used for the auto-managed quick_queries add a new object to the overrides array for each file you would like to modify settings for.
Example:
```js
  quick_queries: [{
      cwd: '<%= app_dir %>', // any grunt.file.expand settings (see https://gruntjs.com/api/grunt.file)
      src: ['**/*.xml', '!**/temp_*.xml'], // any list of grunt file patterns
      build_dir: '<%= build_dir %>/app',
      overrides: [{
          file: 'hello_world.xml',  // required - indicates which file to provide overrides for
          title: 'Hello World Example App', // this will set the title in the platform. the default is the name of the file (minus the extension)
      }]
  }]
```

It is possible to reach any of the overrides and generated properties as expressions in templates:
```js
  // the title of the hello_world quick_query specified in the overrides array
  <%= quick_queries.hello_world.title %>
   
  or
  
  // the generated table and with path
  <%= quick_queries.hello_world._table %> 
```
  
To manually deploy an individual quick query:
```
    grunt tendo:lib1
```


## Grunt tasks:
All tasks accept any combination of the following command line overrides:
* u = user id
* p = user id password
* a = The full path to where the application is or will be deployed to (example: 'abc.def.my_id.app')
```
    grunt deploy -u my_user_id -a some.amazing.thing.app
```


#### Deploy task
Deploys the application into 1010data creating any folders needed.  The root of the application is declared as 'root_path' in 'build.config.js'.
```js
    root_path: 'pub.consumer_data.oi.internal.workspace.<%= login.id %>.app'
``` 
 
If you do not have write permissions to this folder change it to somewhere you do.  Or you may specify the path as command line arg '-a' or specify via an environment variable 'TENTENAPPPATH'.
   
For example:
```js
    root_path: 'pub.mydepartment.somewhere.<%= login.id %>.app'
``` 

 login.id will be replaced with the user id used to run the grunt command.
 
 To run:
 ```
     grunt deploy
 ```    

#### Serve task
Can be used to automate file changes (deploying, tokenizing, etc). 

* Starts a 'connect' http webserver locally ([http://localhost:8000/](http://localhost:8000/)) (see 'tasks/configure.connect.js') ,
* Watches for file changes (see 'tasks/configure.watch.js) and runs configured tasks.
* Notifies '[LiveReload](https://chrome.google.com/webstore/search/livereload)' chrome extension to refresh page (see 'tasks/configure.connect.js').  Also, see [livereload.com](https://chrome.google.com/webstore/search/livereload) for more info.

To run:
```
    grunt serve
```    

#### Unit_tests task
Runs all Unit tests (*.spec.js, ignores *.e2e.spec.js) for the app deployed into 1010data platform. These tests use tendo.

To run:
```
    grunt unit_tests
```    

#### E2e_tests task
Runs all End-to-End tests (*.e2e.spec.js) for the app deployed into 1010data platform.  These tests use selenium.    

To run:
```
    grunt e2e_tests
```    

#### Weather task
This task is an example of running a query and logging the results to the console. It also shows how to manually create your own 'watch' and 'tendo' tasks. See the 'weather' node in 'tasks/configure.tendo.js'. 

To run:
```
    grunt weather
```


## Testing:
TODO: move to a separate page and document :-)
##### Creating unit tests for queries which use a dynamic tag
* TODO (see lib2.spec.xml for an example)

##### Creating unit tests
* TODO (see lib2.spec.xml and queries.spec.js for an example)

##### Creating e2e tests
* TODO (see hello_world.e2e.js for an example)


##### Test Driven Development (TDD)
* TODO (search tdd in build.config.js)

## Tenup:

Follow this tutorial to add tenup support to the project [Tenup Tutorial](AddingTenupSupport.md) (TODO: Not finished)


#### Tenup Installation Error on Mac
Error:

```
Fatal error: dyld: Library not loaded: /usr/local/lib/libodbc.2.dylib
  Referenced from: /applications/tenup
  Reason: image not found


Please ensure the 'tenup' executable is available:
        Option 1: add tenup executable to the system path.
        Option 2: pass the full path and tenup executable name to this method by setting 'options.executable'
        Option 3: specify the home directory of the tenup executable via an environment variable named 'TENUP_HOME'
```

Solution:

```
brew install unixodbc
```