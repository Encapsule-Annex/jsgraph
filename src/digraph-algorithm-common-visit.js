// Copyright (c) 2014-2015 Christopher D. Russell
// https://github.com/encapsule/jsgraph
//
// Wraps call to DirectedGraph algorithm visitor function callbacks.

var helperFunctions = require('./helper-functions');

/*
  request = {
      visitor: interface object reference
      method: string name of the visitor method to call
      request: request object to pass to the visitor method
  },
  response = {
      error: null or string explaining by response.error is null
      result: null (error) or Boolean flag set true to continue search
  }
*/

module.exports = function (request_) {

    var response = { error: null, result: null };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        var visitorCallback = request_.visitor[request_.method];
        if ((visitorCallback === null) && !visitorCallback) {
            // If the visitor is not defined on the visitor object, return true to continue the search.
            response.result = true;
            break;
        }
        var continueSearch = visitorCallback(request_.request);
        var jstype = helperFunctions.JSType(continueSearch);
        if (jstype !== '[object Boolean]') {
            errors.unshift("BFS visitor." + request_.method + " returned type '" + jstype + "' instead of expected '[object Boolean]'.");
            break;
        }
        response.result = continueSearch;
    }
    if (errors.length) {
        response.error = errors.join(' ');
    }
    return response;
};



