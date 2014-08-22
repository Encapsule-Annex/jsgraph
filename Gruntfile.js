// encapsule/jsgraph/Gruntfile.js

module.exports = function (grunt_) {

    var configObject = {
        pkg: grunt_.file.readJSON("package.json"),

        jshint: {
            files: [ 'Gruntfile.js', 'library.js', 'src/*.js', 'test/*.js' ],
            options: {
            }
        },

        // Execute server-side Mocha tests using the grunt-mocha-test module.

        mochaTest: {
            options: { reporter: 'spec', checkLeaks: true },
            src: [
                // tests.js is scratchpad for experimenting with Mocha et al.
                'test/tests.js',

                // Directed graph container object DirectedGraph tests.
                'test/digraph-test.js',

                // Directed graph container object transposition tests.
                'test/digraph-transpose-test.js',

                // DirectedGraph object-based breadth-first visitor algorithm tests.
                'test/digraph-bfv-test.js',

                // DirectedGraph object-based breadth-first search algorithm tests.
                'test/digraph-bfs-test.js',

                // DirectedGraph object-based depth-first visitor algorithm tests.
                'test/digraph-dfv-test.js',

                // DirectedGraph object-based depth-first search algorithm tests.
                'test/digraph-dfs-test.js'

            ]
        }
    };

    grunt_.initConfig(configObject);

    grunt_.loadNpmTasks("grunt-contrib-clean");
    grunt_.loadNpmTasks("grunt-contrib-jshint");
    grunt_.loadNpmTasks("grunt-mocha-test");

    grunt_.registerTask("lint", [ "jshint" ]);
    grunt_.registerTask("test", [ "mochaTest" ]);
    grunt_.registerTask("default", [ "lint", "test" ]);

};
