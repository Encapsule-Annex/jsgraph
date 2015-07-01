// Encapsule/jsgraph/index.js
// Public package exports for jsgraph module.

var DirectedGraph = require('./src/digraph');

var createTraversalContext = require('./src/digraph-algorithm-common-context');
var digraphTranspose = require('./src/digraph-algorithm-transpose');
var digraphBFT = require('./src/digraph-algorithm-bft');

// In flux::
var digraph_dfs = require('./src/digraph-dfs');
// NEW STUFF :: HOLD OFF ON DFT FOR NOW...
// var DFT = require('./src/digraph-algorithm-dft');
// var createDepthFirstTraverseContext = require('./src/digraph-algorithm-dft-context');


module.exports = {

    // Generic directed graph container.
    DirectedGraph: DirectedGraph, 

    // Directed graph algorithms and transforms.
    directed: {

        // Color constants.
        colors: require('./src/digraph-algorithm-common-colors'),

        // Directed graph transposition algorithm.
        transpose: digraphTranspose,

        // Directed graph breadth-first visit and search algorithms (unified API).
        breadthFirstTraverse: digraphBFT,

        // Directed graph depth-first visit and search algorithms.
        createDepthFirstSearchContext: digraph_dfs.createDepthFirstSearchContext,
        depthFirstVisit: digraph_dfs.depthFirstVisit,
        depthFirstSearch: digraph_dfs.depthFirstSearch        

        // Directed graph traversal context factory (advanced).
        createTraversalContext: digraphTraverseContext,


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


