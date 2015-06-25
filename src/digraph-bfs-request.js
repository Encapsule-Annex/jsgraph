// Encapsule/jsgraph/src/digraph-bfs-request.js
//

var helperFunctions = require('./helper-functions');
var createBreadthFirstSearchContext = require('./digraph-bfs-context');

/*

  request = {
  digraph: reference to jsgraph.DirectedGraph container object (required)
  visitor: reference to jsgraph BFV visitor object (required)
  options: {
  startVector: reference to a vertex ID string, or an array of vertex ID strings (optional)
  Note: if ommitted, BFS uses the digraph's root vertex set as the start vertex set
  signalStart: Boolean flag (optional - default is true if ommitted)
  Note: By default, BFS will call startVertex on each search root vertex.
  In advanced scenarios you may wish to override this behavior.
  searchContext: reference to BFS search context object (optional)
  Note: By default, BFS allocates the search context internally and returns it to
  the caller. In advanced scenarios you may wish to provide a pre-initialized
  (or potentially pre-colored) search context object.
  }
  }

  response = {
  error: null indicating success or a string containing an explanation of the failure
  result: {
  searchCompleted: Boolean flag
  searchContext: reference to the BFS search context object
  } // or null to indicate a failure

*/

module.exports = function (request_) {

    var response = { error: null, result: null };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {

        var request = null;

        // Verify the outer shape of the request object.
        var innerResponse = helperFunctions.getJSType(request_);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing request object ~. Found type '" + innerResponse + "'.");
            break;
        }
        request = {};
        innerResponse = helperFunctions.getJSType(request_.digraph);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing required DirectedGraph reference ~.digraph. Found type '" + innerResponse + "'.");
            break;
        }
        request.digraph = request_.digraph;
        innerResponse = helperFunctions.getJSType(request_.visitor);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing required visitor object reference ~.visitor. Found type '" + innerResponse + "'.");
            break;
        }
        request.visitor = request_.visitor;
        innerResponse = helperFunctions.getJSType(request_.options);
        if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Object]')) {
            errors.unshift("Options object ~.options is the wrong type. Found type '" + innerResponse + "'.");
            break;
        }
        request.options = {};
        if (innerResponse === '[object Object]') {
            innerResponse = helperFunctions.getJSType(request_.options.startVector);
            switch (innerResponse) {
            case '[object Undefined]':
                break;
            case '[object String]':
                request.options.startVector = [ request_.options.startVector ];
                break;
            case '[object Array]':
                request.options.startVector = request_.options.startVector;
                break;
            default:
                errors.unshift("Options object property ~.options.startVector is the wrong type. Expected either '[object String]', '[object Array]', or '[object Undefined]'. Found type '" + innerResponse + "'.");
                break;
            } // end switch

            if (errors.length) {
                break;
            }

            innerResponse = helperFunctions.getJSType(request_.options.signalStart);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Boolean]')) {
                errors.unshift("Options object property ~.options.signalStart is the wrong type. Expected either '[object Boolean]' or '[object Undefined]'. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse === '[objectBoolean]') {
                request.options.signalStart = request_.options.signalStart;
            }

            innerResponse = helperFunctions.getJSType(request_.options.searchContext);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Object]')) {
                errors.unshift("Options object property ~.options.searchContext is the wrong type. Expected either '[object Object]' or '[object Undefined']. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse === '[object Object]') {
                request.options.searchContext = request_.options.searchContext;
            }

        } // end if options object specified
        
        helperFunctions.setValueIfUndefined(request.options.startVector, request.digraph.getRootVertices);
        helperFunctions.setValueIfUndefined(request.options.signalStart, true);
        helperFunctions.setValueIfUndefined(request.options.searchContext, createBreadthFirstSearchContext);





    }
    if (errors.length) {
        response.error = errors.join(' ');
    }
    return response;

};
