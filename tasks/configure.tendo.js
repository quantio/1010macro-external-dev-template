module.exports = function (grunt) {

    var buildConfig = require('../env.config.js')(grunt);
    var _ = require('lodash');

    function mapSrcOrTokenizedFile(acc, o, name) {
        var obj = _.cloneDeep(o);
        // use the tokenized file
        if (obj.dest)
            obj.src = obj.dest;
        acc[name] = obj;
        return acc;
    }

    return _.extend({
            options: {
                login: {
                    'TENTENGW': '<%= login.gateway %>',
                    'TENTENUID': '<%= login.id %>',
                    'TENTENPW': '<%= login.password %>'
                },
                args: '-K -y -Y "*" --query',
                logResults: true,
                logTenDoCmd: true
            },

            weather: {
                table: 'pub.demo.weather.pwcodes',
                src: ['src/queries/weather.xml'],
                options: {
                    args: '-K'
                }
            }
        },

        // add all of the quick_queries as available tendo tasks
        _.reduce(buildConfig['quick_queries'], mapSrcOrTokenizedFile, {}),

        // add all of the initialization quick_queries as available tendo tasks
        _.reduce(buildConfig['init_queries'], mapSrcOrTokenizedFile, {})
    );
};
