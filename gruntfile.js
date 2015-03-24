module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
                src: ["src/**/*.ts"],
                options:{
                    module: "commonjs",
                    target: "es5"
                }
            },
            watch:{
                src: ["src/**/*.ts", "!node_modules/**/*.ts"],
                verbose: false,
                options: {
                    module: "commonjs",
                    target: "es5"
                },
                watch: "src/**/*.ts"
            }
        },

    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
    grunt.registerTask("watch", ["ts:watch"]);
};
