module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            css: {
                src: ["<banner>", "<file_strip_banner:css/index.css>"],
                dest: "css/index.cat.css"
            },
            js: {
                src: ["<banner>", "<file_strip_banner:js/index.js>"],
                dest: "js/index.cat.js"
            }
        },
        jshint: {
            options: {
                asi: true
            }
        },
        lint: {
            pre_concat: ["grunt.js", "js/index.js"],
            pst_concat: ["js/index.cat.js"]
        },
        meta: {
            banner: '/*! <%= meta.name %> <%= meta.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */',
            name: "Topoi",
            version: "0.0.0"
        },
        min: {
            files: {
                src: "js/index.cat.js",
                dest: "js/index.min.js"
            }
        },
        mincss: {
            compress: {
                files: {
                    "css/index.min.css": ["css/index.cat.css"]
                }
            }
        },
        uglify: {
        },
        watch: {
            all: {
                files: "js/index.js",
                tasks: "default"
            }
        }
    })
    grunt.loadNpmTasks("grunt-contrib-mincss")
    grunt.registerTask("default", "lint:pre_concat concat lint:pst_concat min mincss")
}