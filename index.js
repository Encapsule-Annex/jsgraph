// library.js - encapsule/jsgraph module exports

var digraph = require('./src/digraph');
var digraph_bfs = require('./src/digraph-bfs');
var digraph_dfs = require('./src/digraph-dfs');
var digraph_transpose = require('./src/digraph-transpose');

module.exports = {

    // Generic directed graph container.
    DirectedGraph: digraph, 
    // Directed graph-specific algorithms and transforms.
    directed: {
        // Generic, in-memory directed graph container object.
        // Directed graph transposition algorithm.
        transpose: digraph_transpose,
        // Directed graph breadth-first visit and search algorithms.
        createBreadthFirstSearchContext: digraph_bfs.createBreadthFirstSearchContext,
        breadthFirstVisit: digraph_bfs.breadthFirstSearch,
        breadthFirstSearch: digraph_bfs.breadthFirstSearch,
        // Directed graph depth-first visit and search algorithms.
        createDepthFirstSearchContext: digraph_dfs.createDepthFirstSearchContext,
        depthFirstVisit: digraph_dfs.depthFirstVisit,
        depthFirstSearch: digraph_dfs.depthFirstSearch
    },

    // Someday this too will be available.
    // 
    // Generic undirected graph container.
    // UndirectedGraph: ugraph
    // Undirected graph-specific algorithms and transforms.
    // undirected: {}

};


