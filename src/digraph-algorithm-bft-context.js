// Encapsule/jsgraph/src/digraph-bfs-contex.js
//

var helperFunctions = require('./helper-functions');
var colors = require('./digraph-algorithm-bft-colors');

module.exports = function (request_) {
    var response = { error: null, result: null };
    var errors = [];
    var bfsContext = { searchStatus: 'pending', colorMap: {}, undiscoveredMap: {} };
    var initializeColorMapRecord = function (vertexId_) {
        bfsContext.colorMap[vertexId_] = colors.white;
        bfsContext.undiscoveredMap[vertexId_] = true;
    };
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        var objectTS = '[object Object]';
        // Verify request.
        var type = helperFunctions.JSType(request_);
        if (type !== objectTS) {
            errors.unshift("Expected request to be of type '" + objectTS + "' but found '" + type + "'.");
            break;
        }
        // Verify request.digraph.
        type = helperFunctions.JSType(request_.digraph);
        if (type !== objectTS) {
            errors.unshift("Expected request.digraph to be of type '" + objectTS + "' but found '" + type + "'.");
            break;
        }
        // Initialize the BFS search context object.
        request_.digraph.getVertices().forEach(initializeColorMapRecord);
        // Assign the result. Note that it's incumbant upon the first invocation of
        // BF* to check/set the bfsContext.searchStatus flag and correctly call the
        // visitor.initializeVertex callback on each vertex in the color map prior
        // to the start of the search. bfsContext.searchStatus should be 'running'
        // while a search is in progress. 'terminated' if prematurely terminated
        // by client visitor code. 'complete' when search concludes normally.
        response.result = bfsContext;
    }
    if (errors.length) {
        errors.unshift("jsgraph.directed.createBreadthFirstSearchContext failed:");
        response.error = errors.join(' ');
    }
    return response;
};
