// digraph-json-export.js
//

// Export the topology and attached vertex and edge properties
// of a DirectedGraph container object as a JSON-format UTF8 
// string. This canonical format can be passed as an optional
// constructor parameter to restore container state across
// execution contexts.

module.exports = function (digraph_, replacer_, space_) {
    var exportObject = {
        vertices: [],
        edges: []
    };
    var vertexId;
    var vertexMap = digraph_.vertexMap;

    var processEdge = function(edge_) {
        var edgeProps = digraph_.edgePropertyObject(edge_.u, edge_.v);
        exportObject.edges.push({ u: edge_.u, v: edge_.v, props: edgeProps });
    };

    for (vertexId in vertexMap) {
        var vertexDescriptor = vertexMap[vertexId];
        exportObject.vertices.push({ id: vertexId, props: vertexDescriptor.properties });
        var outEdges = digraph_.outEdges(vertexId);
        outEdges.forEach(processEdge);
    }
    return JSON.stringify(exportObject, replacer_, space_);
};
