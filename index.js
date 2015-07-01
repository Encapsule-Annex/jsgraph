// Encapsule/jsgraph/index.js
// Public package exports for jsgraph module.

var DirectedGraph = require('./src/digraph');

// Breadth-first Traverse (BFT): Unifies breadth-first visit and search algorithms.
var BFT = require('./src/digraph-algorithm-bft');
var createBreadthFirstTraverseContext = require('./src/digraph-algorithm-bft-context');

// Depth-First Traverse (DFT): Unifies depth-first visit and search algorithms.

var digraph_dfs = require('./src/digraph-dfs');
var digraph_transpose = require('./src/digraph-algorithm-transpose');

// NEW STUFF :: HOLD OFF ON DFT FOR NOW...
// var DFT = require('./src/digraph-algorithm-dft');
// var createDepthFirstTraverseContext = require('./src/digraph-algorithm-dft-context');

var digraph_transpose = require('./src/digraph-algorithm-transpose');


module.exports = {

    // Generic directed graph container.
    DirectedGraph: DirectedGraph, 

    // Directed graph algorithms and transforms.
    directed: {

        // Directed graph transposition algorithm.
        transpose: digraph_transpose,

        // Directed graph breadth-first visit and search algorithms (unified API).
        breadthFirstTraverse: BFT,
        createBreadthFirstTraverseContext: createBreadthFirstTraverseContext,

        // Directed graph depth-first visit and search algorithms.
        createDepthFirstSearchContext: digraph_dfs.createDepthFirstSearchContext,
        depthFirstVisit: digraph_dfs.depthFirstVisit,
        depthFirstSearch: digraph_dfs.depthFirstSearch        

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


