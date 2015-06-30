// digraph-json-export.js
//

// Export the topology and attached vertex and edge properties
// of a DirectedGraph container object as a JSON-format UTF8 
// string. This canonical format can be passed as an optional
// constructor parameter to restore container state across
// execution contexts.


var DigraphDataExporter = module.exports = {};

DigraphDataExporter.exportObject = function (digraph_) {
    var digraphState = {
        vlist: [],
        elist: []
    };
    var vertexMap = digraph_.vertexMap;
    var vertexId;
    var processEdge = function(edge_) {
        var edgeProps = digraph_.getEdgeProperty(edge_.u, edge_.v);
        digraphState.elist.push({ e: { u: edge_.u, v: edge_.v}, p: edgeProps });
    };
    for (vertexId in vertexMap) {
        var vertexDescriptor = vertexMap[vertexId];
        digraphState.vlist.push({ u: vertexId, p: vertexDescriptor.properties });
        var outEdges = digraph_.outEdges(vertexId);
        outEdges.forEach(processEdge);
    }
    return digraphState;
};

DigraphDataExporter.exportJSON = function (digraph_, replacer_, space_) {
    return JSON.stringify(DigraphDataExporter.exportObject(digraph_), replacer_, space_);
};
