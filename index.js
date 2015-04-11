// library.js - encapsule/jsgraph module exports

var digraph = require('./src/digraph');
var bfs = require('./src/digraph-bfs');
var dfs = require('./src/digraph-dfs');
var transposeDigraph = require('./src/digraph-transpose');

module.exports = {
    directed: {
        // Generic, in-memory directed graph container object.
        DirectedGraph: digraph,
        // Directed graph transposition algorithm.
        transpose: transposeDigraph,
        // Directed graph breadth-first visit and search algorithms.
        createBreadthFirstSearchContext: bfs.createBreadthFirstSearchContext,
        breadthFirstVisit: bfs.breadthFirstSearch,
        breadthFirstSearch: bfs.breadthFirstSearch,
        // Directed graph depth-first visit and search algorithms.
        createDepthFirstSearchContext: dfs.createDepthFirstSearchContext,
        depthFirstVisit: dfs.depthFirstVisit,
        depthFirstSearch: dfs.depthFirstSearch
    },

    undirected: {
    }

};


