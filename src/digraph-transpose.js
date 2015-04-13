// digraph-transpose.js

// transposeDirectedGraph computes the transpose of input digraph_,
// returns the the result as a new DirectedGraph instance.
// More info on directed graph transposition:
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/transpose_graph.html

var DirectedGraph = require('../src/digraph');

module.exports = function (digraphIn_) {

    var digraphOut = new DirectedGraph();
    var outEdges = [];
    var index;

    for (var vertexId in digraphIn_.vertexMap) {
        var vertexProperties = JSON.parse(JSON.stringify(digraphIn_.getVertexProperty(vertexId)));
        digraphOut.addVertex(vertexId, vertexProperties);
        var adjacentEdges = digraphIn_.outEdges(vertexId);
        for (index in adjacentEdges) {
            outEdges.push(adjacentEdges[index]);
        }
    }

    for (index in outEdges) {
        var edge = outEdges[index];
        var edgeProperties = JSON.parse(JSON.stringify(digraphIn_.getEdgeProperty(edge.u, edge.v)));
        digraphOut.addEdge(edge.v, edge.u, edgeProperties);
    }

    return digraphOut;

};

