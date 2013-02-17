module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                asi: true
            }
        },
        lint: {
            files: ["grunt.js", "js/index.js"]
        },
        useref: {
            html: "index.html",
            temp: "."
        }
    })
    grunt.loadNpmTasks("grunt-useref")
    grunt.registerTask("default", "lint useref concat cssmin min")
}