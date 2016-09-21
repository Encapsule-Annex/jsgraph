/*
  Encapsule/jsgraph/src/digraph-json-import.js

  Copyright (C) 2014-2015 Christopher D. Russell

  This library is published under the MIT License and is part of the
  Encapsule Project System in Cloud (SiC) open service architecture.
  Please follow https://twitter.com/Encapsule for news and updates
  about jsgraph and other time saving libraries that do amazing things
  with in-memory data on Node.js and HTML.
*/

module.exports = function (digraph_, jsonOrObject_) {

    var jsonParse;
    var getType = function(ref_) { return Object.prototype.toString.call(ref_); };
    var response = { error: null, result: null };
    var errors = [];
    var inBreakScope = false;

    var processVertex = function(vertexDescriptor_) {
        type = getType(vertexDescriptor_);
        if (type !== '[object Object]') {
            errors.unshift("JSON semantics error: Expected vertex descriptor object in 'vlist' array but found '" + type + "' instead.");
        } else {
            type = getType(vertexDescriptor_.u);
            if (type !== '[object String]') {
                errors.unshift("JSON semantics error: Expected vertex descriptor property 'u' to be a string but found '" + type + "' instead.");
            } else {
                digraph_.addVertex({ u: vertexDescriptor_.u, p: vertexDescriptor_.p});
            }
        }
    };

    var processEdge = function (edgeDescriptor_) {
        type = getType(edgeDescriptor_);
        if (type !== '[object Object]') {
            errors.unshift("JSON semantics error: Expected edge descriptor object in 'elist' array but found '" + type + "' instead.");
        } else {
            type = getType(edgeDescriptor_.e);
            if (type !== '[object Object]') {
                errors.unshift("JSON semantics error: Edge record in 'elist' should define edge descriptor object 'e' but but found '" + type + "' instead.");
            } else {
                type = getType(edgeDescriptor_.e.u);
                if (type !== '[object String]') {
                    errors.unshift("JSON semantics error: Expected edge descriptor property 'e.u' to be a string but found '" + type + "' instead.");
                } else {
                    type = getType(edgeDescriptor_.e.v);
                    if (type !== '[object String]') {
                        errors.unshift("JSON semantics error: Expected edge descriptor property 'e.v' to be a string but found '" + type + "' instead.");
                    } else {
                        digraph_.addEdge({ e: edgeDescriptor_.e, p: edgeDescriptor_.p});
                    }
                }
            }
        }
    };

    while (!inBreakScope) {
        inBreakScope = true;

        var type = getType(jsonOrObject_);
        switch (type) {
        case '[object String]':
            try {
                jsonParse = JSON.parse(jsonOrObject_);
            } catch (exception_) {
                errors.unshift("Exception occurred while parsing JSON: " + exception_.message);
            }
            break;
        case '[object Object]':
            jsonParse = jsonOrObject_;
            break;
        default:
            errors.unshift("Invalid reference to '" + type + "' passed instead of expected JSON (or equivalent object) reference.");
        }
        if (errors.length) {
            break;
        }

        type = getType(jsonParse);
        if (type !== '[object Object]') {
            errors.unshift("JSON semantics error: Expected top-level object but found '" + type + "'.");
            break;
        }

        type = getType(jsonParse.name);
        switch (type) {
        case '[object Undefined]':
            jsonParse.name = "";
            break;
        case '[object String]':
            break;
        default:
            errors.unshift("JSON semantics error: Expected 'name' to be a string but found '" + type + "'.");
            break;
        }
        digraph_.setGraphName(jsonParse.name);
        
        type = getType(jsonParse.description);
        switch (type) {
        case '[object Undefined]':
            jsonParse.description = "";
            break;
        case '[object String]':
            break;
        default:
            error.unshift("JSON semantics error: Expected 'description' to be a string but found '" + type + "'.");
            break;
        }
        digraph_.setGraphDescription(jsonParse.description);
            
        type = getType(jsonParse.vlist);
        switch (type) {
        case '[object Undefined]':
            jsonParse.vlist = []; // default to empty vertex list
            break;
        case '[object Array]':
            // do nothing the array is parsed below
            break;
        default:
            errors.unshift("JSON semantics error: Expected 'vlist' (vertices) to be an array but found '" + type + "'.");
            break;
        }
        if (errors.length) {
            break;
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
            errors.unshift("JSON semantics error: Expected 'elist' (edges) to be an array but found '" + type + "'.");
        }
        if (errors.length) {
            break;
        }

        jsonParse.vlist.forEach(processVertex);
        if (errors.length) {
            break;
        }

        jsonParse.elist.forEach(processEdge);
        if (errors.length) {
            break;
        }

    } // while !inBreakScope

    if (errors.length) {
        response.error = errors.join(' ');
    } else {
        response.result = true;
    }

    return response;

};
