// Encapsule/jsgraph/src/digraph-algorithm-common-context.js


var helperFunctions = require('./helper-functions');
var colors = require('./digraph-algorithm-common-colors');

module.exports = function (request_) {
    var response = { error: null, result: null };
    var errors = [];
    var traverseContext = { searchStatus: 'pending', colorMap: {}, undiscoveredMap: {} };
    var initializeColorMapRecord = function (vertexId_) {
        traverseContext.colorMap[vertexId_] = colors.white;
        traverseContext.undiscoveredMap[vertexId_] = true;
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
        // traversal algorithm  to check/set the traverseContext.searchStatus flag and
        // correctly call the visitor.initializeVertex callback on each vertex in the
        // color map prior to the start of the search. traverseContext.searchStatus should
        // be 'running' while a search is in progress. 'terminated' if prematurely terminated
        // by client visitor code. 'complete' when search concludes normally.
        response.result = traverseContext;
    }
    if (errors.length) {
        errors.unshift("jsgraph.directed.createTraverseContext failed:");
        response.error = errors.join(' ');
    }
    return response;
};
