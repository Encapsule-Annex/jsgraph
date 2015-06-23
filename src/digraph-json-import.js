// digraph-json-import.js
//

module.exports = function (digraph_, json_) {

    var jsonParse;
    var getType = function(ref_) { return Object.prototype.toString.call(ref_); };

    var type = getType(json_);
    switch (type) {
    case '[object String]':
        try {
            jsonParse = JSON.parse(json_);
        } catch (exception_) {
            throw new Error("JSON parse error: Cannot import invalid JSON document into jsgraph.");
        }
        break;
    case '[object Object]':
        jsonParse = json_;
        break;
    default:
        throw new Error("Invalid reference to '" + type + "' passed instead of expected JSON (or equivalent object) reference.");
    }

    type = getType(jsonParse);
    if (type !== '[object Object]') {
        throw new Error("JSON semantics error: Expected top-level object but found '" + type + "'.");
    }

    type = getType(jsonParse.jsgraph);
    if (type !== '[object Object]') {
        throw new Error("JSON semantics error: Could not find required top-level object 'jsgraph'.");
    }

    type = getType(jsonParse.jsgraph.digraph);
    if (type !== '[object Object]') {
        throw new Error("JSON semantics error: Could not find expected digraph state object 'jsgraph.directed'.");
    }

    digraphJSON = jsonParse.jsgraph.digraph;

    type = getType(digraphJSON.vertices);
    if (type !== '[object Array]') {
        throw new Error("JSON semantics error: Expected 'vertices' to be an array but found '" + type + "'.");
    }

    type = getType(digraphJSON.edges);
    if (type !== '[object Array]') {
        throw new Error("JSON semantics error: Expected 'edges' to be an array but found '" + type + "'.");
    }

    digraphJSON.vertices.forEach(function(vertexDescriptor_) {
        type = getType(vertexDescriptor_);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: Expected vertex descriptor object in 'vertices' array but found '" + type + "' instead.");
        }
        type = getType(vertexDescriptor_.v);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected vertex descriptor property 'v' to be a string but found '" + type + "' instead.");
        }
        digraph_.addVertex(vertexDescriptor_.v, vertexDescriptor_.p);
    });

    digraphJSON.edges.forEach(function(edgeDescriptor_) {
        type = getType(edgeDescriptor_);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: Expected edge descriptor object in 'edges' array but found '" + type + "' instead.");
        }
        type = getType(edgeDescriptor_.u);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected edge descriptor property 'u' to be a string but found '" + type + "' instead.");
        }
        type = getType(edgeDescriptor_.v);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected edge descriptor property 'v' to be a string but found '" + type + "' instead.");
        }
        digraph_.addEdge(edgeDescriptor_.u, edgeDescriptor_.v, edgeDescriptor_.p);
    });

    return true;

};
