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

    type = getType(jsonParse.vlist);
    switch (type) {
    case '[object Undefined]':
        jsonParse.vlist = []; // default to empty vertex list
        break;
    case '[object Array]':
        // do nothing the array is parsed below
        break;
    default:
        throw new Error("JSON semantics error: Expected 'vlist' (vertices) to be an array but found '" + type + "'.");
    }

    type = getType(jsonParse.elist);
    switch (type) {
    case '[object Undefined]':
        jsonParse.elist = []; // default to empty edge list
        break;
    case '[object Array]':
        // do nothing
        break;
    default:
        throw new Error("JSON semantics error: Expected 'e' (edges) to be an array but found '" + type + "'.");
    }

    jsonParse.vlist.forEach(function(vertexDescriptor_) {
        type = getType(vertexDescriptor_);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: Expected vertex descriptor object in 'v' array but found '" + type + "' instead.");
        }
        type = getType(vertexDescriptor_.u);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected vertex descriptor property 'u' to be a string but found '" + type + "' instead.");
        }
        digraph_.addVertex(vertexDescriptor_.u, vertexDescriptor_.p);
    });

    jsonParse.elist.forEach(function(edgeDescriptor_) {
        type = getType(edgeDescriptor_);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: Expected edge descriptor object in 'elist' array but found '" + type + "' instead.");
        }
        type = getType(edgeDescriptor_.e);
        if (type !== '[object Object]') {
            throw new Error("JSON semantics error: 'elist' array should contain object(s) but but found '" + type + "' instead.");
        }
        type = getType(edgeDescriptor_.e.u);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected edge descriptor property 'e.u' to be a string but found '" + type + "' instead.");
        }
        type = getType(edgeDescriptor_.e.v);
        if (type !== '[object String]') {
            throw new Error("JSON semantics error: Expected edge descriptor property 'e.v' to be a string but found '" + type + "' instead.");
        }
        digraph_.addEdge(edgeDescriptor_.e.u, edgeDescriptor_.e.v, edgeDescriptor_.p);
    });

    return true;

};
