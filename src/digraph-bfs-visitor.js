// Encapsule/jsgraph/src/digraph-bfs-visitor.js
//

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
        if ((request_.visitor[request_.method] === null) && !request_.visitor[request_.method]) {
            // If the visitor is not defined on the visitor object, return true to continue the search.
            response.result = true;
            break;
        }
        var continueSearch = request_.visitor[request_.method](request_.request);
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



