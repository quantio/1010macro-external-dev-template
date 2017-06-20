# Tutorial to add Tenup support to a project
The goal of this tutorial will be to demonstrate:
1. Installation of the tenup plugins
2. Creating and configuring a grunt tenup task
3. Execute the tenup task which will create a new table in the platform


## Install Tenup executable
Please visit [Tenup](https://www2.1010data.com/documentationcenter/beta/TenupUsersGuide/index_frames.html) for download and installation instructions.

## Install the Tenup plugins
Add the latest tenup and grunt-tenup plugins using the node.js package manager
```
    npm install tenup --save
    npm install grunt-tenup --save
```    

Note: References to these plugins will be added to 'package.json'


## Create the grunt configuration
Here we will create and configure the grunt-tenup plugin.  We will add a single grunt task

*  Create a file named 'configure.tenup.js' in the project folder 'tasks'.  It is important the file be named 'configure.tenup.js' so the automated config loader finds it.
*  Copy the below contents into the file:'
```js
module.exports = function (grunt) {
    var defaultOptions = {
        // default options for all tenup tasks (they can be overriden)
        options: {
            login: {
                'TENTENGW': '<%= login.gateway %>',
                'TENTENUID': '<%= login.id %>',
                'TENTENPW': '<%= login.password %>'
            },
            connection_string: 'DSN=sql1010odbc;',
            sql: 'SELECT * FROM <%= root_sql_path %>.{table_name}',
            table: '<%= root_path %>.{table_name}',
            args: '-K -y -Y .',
            logTenUpCmd: true
        }
    };
    
    
    return defaultOptions;
};    
```


TODO: finish



