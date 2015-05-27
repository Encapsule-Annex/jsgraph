// digraph-json-export.js
//

// Export the topology and attached vertex and edge properties
// of a DirectedGraph container object as a JSON-format UTF8 
// string. This canonical format can be passed as an optional
// constructor parameter to restore container state across
// execution contexts.

module.exports = function (digraph_, replacer_, space_) {

    var digraphState = {
        vertices: [],
        edges: []
    };

    var vertexMap = digraph_.vertexMap;
    var vertexId;

    var processEdge = function(edge_) {
        var edgeProps = digraph_.getEdgeProperty(edge_.u, edge_.v);
        digraphState.edges.push({ uid: edge_.u, vid: edge_.v, eprops: edgeProps });
    };

    for (vertexId in vertexMap) {
        var vertexDescriptor = vertexMap[vertexId];
        digraphState.vertices.push({ vid: vertexId, vprops: vertexDescriptor.properties });
        var outEdges = digraph_.outEdges(vertexId);
        outEdges.forEach(processEdge);
    }

    var jsonExportObject = { jsgraph: { digraph: digraphState } };

    return JSON.stringify(jsonExportObject, replacer_, space_);
};
