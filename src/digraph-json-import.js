// digraph-json-import.js
//

module.exports = function (digraph_, jsonOrObject_) {

    var jsonParse;
    var getType = function(ref_) { return Object.prototype.toString.call(ref_); };

    var type = getType(jsonOrObject_);
    switch (type) {
    case '[object String]':
        try {
            jsonParse = JSON.parse(jsonOrObject_);
        } catch (exception_) {
            throw new Error("JSON parse error: Cannot import invalid JSON document into jsgraph.");
        }
        break;
    case '[object Object]':
        jsonParse = jsonOrObject_;
        break;
    default:
        throw new Error("Invalid reference to '" + type + "' passed instead of expected JSON (or equivalent object) reference.");
    }

    type = getType(jsonParse);
    if (type !== '[object Object]') {
        throw new Error("JSON semantics error: Expected top-level object but found '" + type + "'.");
    }

    type = getType(jsonParse.v);
    if (type !== '[object Array]') {
        throw new Error("JSON semantics error: Expected 'v' (vertices) to be an array but found '" + type + "'.");
    }

    type = getType(jsonParse.e);
    if (type !== '[object Array]') {
        throw new Error("JSON semantics error: Expected 'e' (edges) to be an array but found '" + type + "'.");
    }

    jsonParse.v.forEach(function(vertexDescriptor_) {
        type = getType(vertexDescriptor_);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: Expected vertex descriptor object in 'v' array but found '" + type + "' instead.");
        }
        type = getType(vertexDescriptor_.v);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected vertex descriptor property 'v' to be a string but found '" + type + "' instead.");
        }
        digraph_.addVertex(vertexDescriptor_.v, vertexDescriptor_.p);
    });

    jsonParse.e.forEach(function(edgeDescriptor_) {
        type = getType(edgeDescriptor_);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: Expected edge descriptor object in 'e' array but found '" + type + "' instead.");
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
