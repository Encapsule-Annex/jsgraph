// digraph-in-parameters.js

var helperFunctions = require('./helper-functions');

var verifyVertexReadRequest = function(request_) {
    var response = { error: null, result: false };
    var jstype = helperFunctions.JSType(request_);
    if (jstype !== '[object String]') {
        response.error = "Invalid value type '" + jstype + "' found vertex read request. Expected '[object String]'.";
    } else {
        response.result = true;
    }
    return response;
};

var verifyVertexWriteRequest = function(request_) {
    var response = { error: null, result: false };
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        var jstype = helperFunctions.JSType(request_);
        if (jstype !== '[object Object]') {
            response.error = "Invalid value type '" + jstype + "' found when expecting a vertex write request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.u);
        if (jstype !== '[object String]') {
            response.error = "Invalid value type '" + jstype + "' found looking for vertex ID string property 'u' in vertex write request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.p);
        if (jstype === '[object Function]') {
            response.error = "Invalid value type '" + jstype + " found while inspecting vertex property 'p' in vertex write request object. Must be serializable to JSON!";
            break;
        }
        response.result = true;
    }
    return response;
};

var verifyEdgeReadRequest = function(request_) {
    var response = { error: null, result: false };
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        var jstype = helperFunctions.JSType(request_);
        if (jstype !== '[object Object]') {
            response.error = "Invalid value type '" + jstype + "' found when expecting edge read request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.u);
        if (jstype !== '[object String]') {
            response.error = "Invalid value type '" + jstype + "' found looking for vertex ID string property 'u' in edge read request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.v);
        if (jstype !== '[object String]') {
            response.error = "Invalid value type '" + jstype + "' found looking for vertex ID string property 'v' in edge read request object.";
            break;
        }
        response.result = true;
    }
    return response;
};

var verifyEdgeWriteRequest = function(request_) {
    var response = { error: null, result: false };
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        var jstype = helperFunctions.JSType(request_);
        if (jstype !== '[object Object]') {
            response.error = "Invalid value type '" + jstype + "' found when expecting edge write request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.e);
        if (jstype !== '[object Object]') {
            response.error = "Invalid value type '" + jstype + "' found looking for edge descriptor object 'e' in edge write request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.e.u);
        if (jstype !== '[object String]') {
            response.error = "Invalid value type '" + jstype + "' found looking for vertex ID string property 'e.u' in edge write request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.e.v);
        if (jstype !== '[object String]') {
            response.error = "Invalid value type '" + jstype + "' found looking for vertex ID string property 'e.v' in edge write request object.";
            break;
        }
        jstype = helperFunctions.JSType(request_.p);
        if (jstype === '[object Function]') {
            response.error = "Invalid value type '" + jstype + "' found while insecting edge property 'p' in edge write request object. Must be serializable to JSON!";
        }
        response.result = true;
    }
    return response;
};

module.exports = {
    verifyVertexReadRequest: verifyVertexReadRequest,
    verifyVertexWriteRequest: verifyVertexWriteRequest,
    verifyEdgeReadRequest: verifyEdgeReadRequest,
    verifyEdgeWriteRequest: verifyEdgeWriteRequest
};
