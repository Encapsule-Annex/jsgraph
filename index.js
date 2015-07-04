// Encapsule/jsgraph/index.js
// Public package exports for jsgraph module.

var DirectedGraph = require('./src/digraph');

var createTraversalContext = require('./src/digraph-algorithm-common-context');
var digraphTranspose = require('./src/digraph-algorithm-transpose');
var digraphBreadthFirstTraverse = require('./src/digraph-algorithm-bft');

// In flux::
var digraph_dfs = require('./src/digraph-dfs');
// NEW STUFF :: HOLD OFF ON DFT FOR NOW...
// var DFT = require('./src/digraph-algorithm-dft');



module.exports = {

    // Generic directed graph container object.
    //
    // var jsgraph = require('jsgraph);
    // var DirectedGraph = jsgraph.DirectedGraph;
    // var digraph = new DirectedGraph(serializedDigraph /*JSON, object, or undefined*/);
    //
    DirectedGraph: DirectedGraph, 

    // Directed graph algorithms and transforms.
    directed: {

        // Color constant hashtable.
        colors: require('./src/digraph-algorithm-common-colors'),

        // Directed graph transposition algorithm.
        transpose: digraphTranspose,

        // Directed graph breadth-first visit and search algorithms (unified API).
        breadthFirstTraverse: digraphBreadthFirstTraverse,

        // Directed graph depth-first visit and search algorithms.
        depthFirstVisit: digraph_dfs.depthFirstVisit,
        depthFirstSearch: digraph_dfs.depthFirstSearch,        

        // Directed graph traversal context factory (advanced).
        createTraversalContext: createTraversalContext


        // NEW STUFF :: 
        // depthFirstTraverse: DTF,
        // createDepthFirstSearchContext: createDepthFirstTraverseContext

    },

    // Someday this too will be available.
    // 
    // Generic undirected graph container.
    // UndirectedGraph: ugraph
    // Undirected graph-specific algorithms and transforms.
    // undirected: {}

};


