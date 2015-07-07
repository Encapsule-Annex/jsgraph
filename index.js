// Encapsule/jsgraph/index.js
// Public package exports for jsgraph module.

//var DirectedGraphContainer = require('./src/digraph');
//var createTraversalContext = require('./src/digraph-algorithm-common-context');
//var digraphTranspose = require('./src/digraph-algorithm-transpose');
//var digraphBreadthFirstTraverse = require('./src/digraph-algorithm-bft');
//var digraphDepthFirstTraverse = require('./src/digraph-algorithm-dft');


var jsgraph = module.exports = {

    // Directed graph algorithms and transforms.
    directed: {

        // Color constant hashtable.
        colors: require('./src/digraph-algorithm-common-colors'),

        ////
        // Create a DirectedGraph container object.
        //
        // var response = jsgraph.directed.create(request);
        //
        // request = Undefined, JSON string, or data object [1]
        //
        // response = {
        //     error: null or string explaining why result is null
        //     result: DirectedGraph container object or null if error
        // }
        //
        // [1] see DirectedGraph.toJSON/toObject methods.
        ////
        create: require('./src/digraph').createDirectedGraph,

        // Directed graph transposition algorithm.
        transpose: require('./src/digraph-algorithm-transpose'),

        // Directed graph breadth-first visit and search algorithms (unified API).
        breadthFirstTraverse: require('./src/digraph-algorithm-bft'),

        // Directed graph depth-first visit and search algorithms.
        depthFirstTraverse: require('./src/digraph-algorithm-dft'),

        // Directed graph traversal context factory (advanced).
        createTraversalContext: require('./src/digraph-algorithm-common-context')

    }
};


