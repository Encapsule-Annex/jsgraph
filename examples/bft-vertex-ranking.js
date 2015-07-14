// Encapsule/jsgraph/examples/bft-vertex-ranking.js

var jsgraph = require('../index'); // in-package example

var response = jsgraph.directed.create({
    elist: [
        { e: { u: "A", v: "B" } },
        { e: { u: "B", v: "C" } },
        { e: { u: "B", v: "D" } }
    ]
});
if (response.error) {
    throw new Error(response.error);
}

var digraph = response.result;


// VERTEX RANKING (i.e. distance from start vertex)
var vertexRankHashtable = {};
var bftVisitorInterface = {
    startVertex: function(request) {
        request.g.setVertexProperty({ u: request.u, p: 0});
        return true;
    },
    treeEdge: function (request) {
        request.g.setVertexProperty({ u: request.e.v, p: request.g.getVertexProperty(request.e.u) + 1});
        return true;
    }
};

// ACTUATE OUR VISITOR INTERFACE WITH BFT TO PRODUCE THE RESULT
response = jsgraph.directed.breadthFirstTraverse({
    digraph: digraph,
    visitor: bftVisitorInterface
});
if (response.error) {
    throw new Error(response.error);
}

console.log("DirectedGraph: '" + digraph.toJSON(undefined, 4) + "'");
console.log("BFT traversal: '" + JSON.stringify(response.result,undefined,4) + "'");

    



