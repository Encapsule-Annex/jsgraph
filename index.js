// Encapsule/jsgraph/index.js
// Public package exports for jsgraph module.

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
        // Creates a new DirectedGraph container object that's identical
        // to a caller-specified digraph except that the direction of the
        // the edges are reverese in the result digraph. Note that if present,
        // vertex and edge properties in the source digraph are copied by
        // reference to the result digraph.
        transpose: require('./src/digraph-algorithm-transpose'),

        // Directed graph breadth-first traversal visitor algorithm.
        breadthFirstTraverse: require('./src/digraph-algorithm-bft'),

        // Directed graph depth-first traversal visitor algorithm.
        depthFirstTraverse: require('./src/digraph-algorithm-dft'),

        // Directed graph traversal context factory (advanced).
        createTraversalContext: require('./src/digraph-algorithm-common-context')

    }
};


