function task(grunt) {
    grunt.initConfig({
        gitlog: {
            todo: {
                options: {
                    verbose: false,
                    prop: 'gitlog.todo.result',
                    callback: function (results) {
                        console.log(results);
                    }
                }
            }
        },
        gitcheckout: {
            undo: {
                options: {
                    branch: '.',
                    verbose: true
                }
            }
        },
        gitpull: {}
    });
    grunt.loadNpmTasks('grunt-git');
    grunt.registerTask('default', ['gitlog:todo']);
    grunt.registerTask('revert', ['gitcheckout:undo']);
}
module.exports = task;
