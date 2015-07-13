/*
  Encapsule/jsgraph/src/digraph-algorithm-common-visit.js

  Copyright (C) 2014-2015 Christopher D. Russell

  This library is published under the MIT License and is part of the
  Encapsule Project System in Cloud (SiC) open service architecture.
  Please follow https://twitter.com/Encapsule for news and updates
  about jsgraph and other time saving libraries that do amazing things
  with in-memory data on Node.js and HTML.
*/

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
        var jstype = helperFunctions.JSType(visitorCallback);
        // If the visitor function is not defined on the visitor object, return true to continue the search.
        if (jstype !== '[object Function]') {
            response.result = true;
            break;
        }
        var continueSearch = visitorCallback(request_.request);
        jstype = helperFunctions.JSType(continueSearch);
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



