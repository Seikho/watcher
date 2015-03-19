function task(grunt) {
grunt.initConfig({
       ts:{ 
           default:{
               src: ["**/*.ts", "!node_modules/**/*.ts"],
               verbose: false,
               options: {
                   module: "commonjs",
                   target: "es5"
               }
           },
           watch:{
               src: ["**/*.ts", "!node_modules/**/*.ts"],
               verbose: false,
               options: {
                   module: "commonjs",
                   target: "es5"
               },
               watch: "src/**/*.ts"
           }
       }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts:default"]);
    grunt.registerTask("watch", ["ts:watch"]);
}
module.exports = task;