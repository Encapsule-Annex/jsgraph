// digraph-json-import.js
//

module.exports = function (digraph_, json_) {

    var jsonParse;

    try {
        jsonParse = JSON.parse(json_);
    } catch (exception_) {
        throw new Error("JSON parse error: Cannot import invalid JSON document into jsgraph.");
    }

    var getType = function(ref_) { return Object.prototype.toString.call(ref_); };

    var type = getType(jsonParse);
    if (type !== '[object Object]') {
        throw new Error("JSON semantics error: Expected top-level object but found '" + type + "'.");
    }

    type = getType(jsonParse.vertices);
    if (type !== '[object Array]') {
        throw new Error("JSON semantics error: Expected 'vertices' to be an array but found '" + type + "'.");
    }

    type = getType(jsonParse.edges);
    if (type !== '[object Array]') {
        throw new Error("JSON semantics error: Expected 'edges' to be an array but found '" + type + "'.");
    }

    jsonParse.vertices.forEach(function(vertexDescriptor_) {
        digraph_.addVertex(vertexDescriptor_.id, vertexDescriptor_.props);
    });

    jsonParse.edges.forEach(function(edgeDescriptor_) {
        digraph_.addEdge(edgeDescriptor_.u, edgeDescriptor_.v, edgeDescriptor_.props);
    });

    return true;

};
