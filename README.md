# 1010macro-external-dev-template
Boilerplate template to provide grunt tasks to:
* run a local server to test quickapps in an iframe. When files change upload to 1010 and then refresh browser via [LiveReload](http://livereload.com/).
* deploy application into 1010 (includes creating folders if they do not exist)
* run queries and see the results in console (via tendo)


## Requirements:
* [Nodejs](http://nodejs.org/)
* [Grunt](http://gruntjs.com/)
* [Tendo](http://www.1010data.com/)

## Optional
* [LiveReload](https://chrome.google.com/webstore/search/livereload) chrome extension to automatically refresh browser when files change. 

## Getting Started
Install the [Nodejs](http://nodejs.org/), [Grunt](http://gruntjs.com/) and [Tendo](http://www.1010data.com/)  


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
* To simplify running grunt tasks add your 1010data user name and password to the system environment.  Please see [Setting Environment Variables](https://www2.1010data.com/documentationcenter/beta/TendoUsersGuide/index_frames.html).
* An additional option is to add a 'TENDO_HOME' environment variable to the path of the TenDo executable.

## Quick usage examples:
Before diving into any of the configs lets see some quick examples!:
 
1. First deploy the app:
```js
    grunt deploy
```    

2. Now start the local server, watchers, livereload, etc:
```js
    grunt serve    
```
    
3. Open a Chrome browser and navigate to (http://localhost:8000/hello.world.html). The "Hello World" quickapp will be loaded into the html iframe.

4. Turn on the livereload extension (located in the upper right hand corner of the chrome browser).

5. Now open 'src/app/hello.world.xml' and change 'Hello World' to 'World Hello' and save.  The serve command will detect the file has change, rebuild it, push it up to 1010 and then refresh the browser ([LiveReload.com](https://chrome.google.com/webstore/search/livereload) extension required).   
   
## Auto-managed quick queries:
Inside of the 'build.config.js' there is a node named 'quick_queries' this is where the auto-managed quick queries are defined.  Each node will automatically have a 'watch', 'tendo' and optionally a 'replace' task created.  
Example:
```js
 quick_queries: {
    ...
        lib1: {
            table: '<%=root_path%>.lib1.lib1\(Library 1\;\;\)=<%= basetable %>',
            src: ['<%= app_dir %>/lib1/lib1.xml']
        }
     ...
}
```
This is the minimal configuration needed to manage the lib1.xml quick_query.  
To manually deploy the query:
```
    grunt tendo:lib1
```


## Grunt tasks:

#### Deploy task
Deploys the application into 1010data creating any folders needed.  The root of the application is declared as 'root_path' in 'build.config.js'.
```
    root_path: 'pub.consumer_data.oi.internal.workspace.<%= login.id %>.app',
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
Runs all unit tests (*.spec.js, ignores *.e2e.spec.js) for the app deployed into 1010data platform. These tests use tendo.

To run:
```
    grunt unit_tests
```    

#### E2e_tests task
Runs all "end to end" tests (*.e2e.spec.js) for the app deployed into 1010data platform.  These tests use selenium.    

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