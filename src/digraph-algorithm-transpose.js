// digraph-transpose.js

// transposeDirectedGraph computes the transpose of input digraph_,
// returns the the result as a new DirectedGraph instance.
// More info on directed graph transposition:
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/transpose_graph.html

var helperFunctions = require('../src/helper-functions');
var DirectedGraph = require('../src/digraph').DirectedGraph;

/*
  request = DirectedGraph reference
  response = {
      error: null or string explaining why result is null
      result: a new DirectedGraph instance with the same vertex set,
              the edge set transposed (direction reversed), and vertex
              and edge properties (if any) linked by reference to the
              source digraph
  }
*/

module.exports = function (digraph_) {
    var response = { error: null, result: null };
    var errors = [];
    var innerResponse;

    var digraphOut = new DirectedGraph();

    var jstype = helperFunctions.JSType(digraph_);
    if (jstype !== '[object Object]') {
        errors.unshift("Expected reference to DirectedGraph but found type '" + jstype + "'.");
    } else {
        
        digraph_.getVertices().forEach(function(vertexId_) {
            innerResponse = digraphOut.addVertex({ u: vertexId_, p: digraph_.getVertexProperty(vertexId_) });
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
            }
        });

        digraph_.getEdges().forEach(function(edge_) {
            innerResponse = digraphOut.addEdge({ e: { u: edge_.v, v: edge_.u }, p: digraph_.getEdgeProperty(edge_) });
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
            }
        });

    } // end else

    if (errors.length) {
        errors.unshift("jsgraph.directed.transpose failed:");
        response.error = errors.join(' ');
    } else {
        response.result = digraphOut;
    }
    return response;
};

